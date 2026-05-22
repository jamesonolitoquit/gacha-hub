const fs = require('fs');
const path = require('path');

const prunedDir = path.join(__dirname, '..', 'data', 'seeds', 'pruned');
const outDir = path.join(__dirname, '..', 'data', 'seeds', 'sql');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function quote(v) {
  if (v === null || v === undefined) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function upsertCharacter(gameId, item) {
  const cols = ['game_id','slug','name','rarity','element','class','role','portrait_url','full_art_url','icon_url','description','release_patch_id'];
  const values = [
    gameId,
    item.slug,
    item.name,
    item.rarity ?? item.rarity ?? null,
    item.element ?? item.element ?? null,
    item.characterClass ?? item.class ?? item.character_class ?? null,
    item.role ?? item.role ?? null,
    item.portrait_url ?? item.portraitUrl ?? item.portrait ?? null,
    item.full_art_url ?? item.fullArtUrl ?? item.full_art ?? null,
    item.icon_url ?? item.iconUrl ?? null,
    item.description ?? item.desc ?? null,
    item.release_patch ?? item.releasePatch ?? null,
  ];

  const colList = cols.join(', ');
  const valList = values.map(quote).join(', ');

  const updates = cols.slice(2).map((c) => `${c}=EXCLUDED.${c}`).join(', ');

  return `INSERT INTO characters (${colList}) VALUES (${valList}) ON CONFLICT (game_id, slug) DO UPDATE SET ${updates};`;
}

function upsertSkill(gameId, item, characterIdPlaceholder = null) {
  // character_id must be resolved post-import; use placeholder comment if missing
  const characterRef = item.owner_slug ? `-- resolve character_id for owner_slug='${item.owner_slug}' (game ${gameId})` : `-- missing owner_slug`; 

  const cols = ['character_id','slug','name','type','description','cooldown_turns','cost','power_type','scaling_stat','targets','range_type','icon_url','animation_url'];
  const values = [
    characterIdPlaceholder !== null ? characterIdPlaceholder : 'NULL',
    item.slug,
    item.name,
    item.type ?? item.type ?? null,
    item.description ?? item.description ?? item.desc ?? null,
    item.cooldown ?? item.cooldownTurns ?? item.cooldown ?? null,
    item.cost ?? item.cost ?? null,
    item.power_type ?? item.powerType ?? null,
    item.scaling_stat ?? item.scalingStat ?? item.scaling_stat ?? null,
    item.targets ?? item.targets ?? null,
    item.range_type ?? item.rangeType ?? null,
    null,
    null,
  ];

  const colList = cols.join(', ');
  const valList = values.map(quote).join(', ');
  const updates = cols.slice(1).map((c) => `${c}=EXCLUDED.${c}`).join(', ');

  return `${characterRef}\nINSERT INTO skills (${colList}) VALUES (${valList}) ON CONFLICT (character_id, slug) DO UPDATE SET ${updates};`;
}

function detectType(item) {
  if (item.owner || item.owner_slug) return 'skill';
  if (item.team_name || item.members) return 'build';
  if (item.tiers_json || item.tiers) return 'tier';
  return 'hero';
}

function process() {
  if (!fs.existsSync(prunedDir)) {
    console.error('No pruned seeds directory at', prunedDir);
    process.exit(1);
  }

  const files = fs.readdirSync(prunedDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('No pruned JSON files found in', prunedDir);
    process.exit(1);
  }

  const outPath = path.join(outDir, 'seed-upserts.sql');
  const parts = [];

  // default game id mapping: attempt to detect gameId from filename (e.g., heroes-game-1.json) or ask user
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  let inferredGameId = env.GAME_ID ? Number(env.GAME_ID) : null;
  if (!inferredGameId) {
    parts.push('-- WARNING: GAME_ID not provided. Replace GAME_ID placeholder with actual integer game id before running this SQL.');
  }

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(prunedDir, file), 'utf8');
    let arr;
    try {
      arr = JSON.parse(raw);
    } catch (e) {
      console.warn('Skipping invalid JSON', file);
      return;
    }

    if (!Array.isArray(arr)) return;
    arr.forEach((item) => {
      const t = detectType(item);
      if (t === 'hero') {
        const gid = inferredGameId !== null ? inferredGameId : '/* GAME_ID */';
        parts.push('-- upsert character ' + (item.slug || item.name));
        parts.push(upsertCharacter(gid, item));
      } else if (t === 'skill') {
        const gid = inferredGameId !== null ? inferredGameId : '/* GAME_ID */';
        parts.push('-- upsert skill ' + (item.slug || item.name));
        // character_id placeholder; maintainers must replace with actual character IDs after character upserts
        parts.push(upsertSkill(gid, item, '/* CHARACTER_ID_FOR_OWNER */'));
      } else {
        // skip builds/tiers for now; can be added later
        parts.push('-- skipping item type ' + t + ' for ' + (item.slug || item.name || file));
      }
    });
  });
  fs.writeFileSync(outPath, parts.join('\n\n'), 'utf8');
  console.log('Wrote SQL upsert preview to', outPath);

  // If DATABASE_URL and GAME_ID present, attempt to run transactional upserts.
  const dbUrl = env.DATABASE_URL;
  const gameId = env.GAME_ID ? Number(env.GAME_ID) : null;

  if (dbUrl && gameId) {
    console.log('DATABASE_URL and GAME_ID detected — attempting transactional upserts.');
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: dbUrl });

    (async () => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // First pass: upsert characters and collect mapping slug -> id
        const charMap = new Map();

        for (const file of files) {
          const raw = fs.readFileSync(path.join(prunedDir, file), 'utf8');
          let arr;
          try { arr = JSON.parse(raw); } catch { continue; }
          if (!Array.isArray(arr)) continue;

          for (const item of arr) {
            if (detectType(item) !== 'hero') continue;

            const q = `INSERT INTO characters (game_id, slug, name, rarity, element, class, role, portrait_url, full_art_url, icon_url, description, release_patch_id)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
              ON CONFLICT (game_id, slug) DO UPDATE SET name=EXCLUDED.name, rarity=EXCLUDED.rarity, element=EXCLUDED.element, class=EXCLUDED.class, role=EXCLUDED.role, portrait_url=EXCLUDED.portrait_url, full_art_url=EXCLUDED.full_art_url, icon_url=EXCLUDED.icon_url, description=EXCLUDED.description, release_patch_id=EXCLUDED.release_patch_id
              RETURNING id;`;

            const values = [gameId, item.slug, item.name, item.rarity ?? null, item.element ?? null, item.characterClass ?? null, item.role ?? null, item.portrait_url ?? null, item.full_art_url ?? null, item.icon_url ?? null, item.description ?? null, item.release_patch ?? null];

            const res = await client.query(q, values);
            const id = res.rows[0]?.id;
            if (id) charMap.set(item.slug, id);
          }
        }

        // Second pass: upsert skills using resolved character ids
        for (const file of files) {
          const raw = fs.readFileSync(path.join(prunedDir, file), 'utf8');
          let arr;
          try { arr = JSON.parse(raw); } catch { continue; }
          if (!Array.isArray(arr)) continue;

          for (const item of arr) {
            if (detectType(item) !== 'skill') continue;

            // resolve character id
            let characterId = null;
            if (item.owner_slug && charMap.has(item.owner_slug)) {
              characterId = charMap.get(item.owner_slug);
            } else if (item.owner_slug) {
              const qr = await client.query('SELECT id FROM characters WHERE game_id=$1 AND slug=$2 LIMIT 1', [gameId, item.owner_slug]);
              if (qr.rows[0]) characterId = qr.rows[0].id;
            }

            if (!characterId) {
              console.warn('Skipping skill; unable to resolve owner_slug to character id for', item.slug, item.owner_slug);
              continue;
            }

            const q = `INSERT INTO skills (character_id, slug, name, type, description, cooldown_turns, cost, power_type, scaling_stat, targets, range_type, icon_url, animation_url)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
              ON CONFLICT (character_id, slug) DO UPDATE SET name=EXCLUDED.name, type=EXCLUDED.type, description=EXCLUDED.description, cooldown_turns=EXCLUDED.cooldown_turns, cost=EXCLUDED.cost, power_type=EXCLUDED.power_type, scaling_stat=EXCLUDED.scaling_stat, targets=EXCLUDED.targets, range_type=EXCLUDED.range_type, icon_url=EXCLUDED.icon_url, animation_url=EXCLUDED.animation_url;`;

            const values = [characterId, item.slug, item.name, item.type ?? null, item.description ?? null, item.cooldown ?? null, item.cost ?? null, item.power_type ?? null, item.scaling_stat ?? null, item.targets ?? null, item.range_type ?? null, null, null];

            await client.query(q, values);
          }
        }

        await client.query('COMMIT');
        console.log('Transactional upserts committed successfully.');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transactional upserts failed, rolled back:', err.message);
      } finally {
        client.release();
        await pool.end();
      }
    })();
  } else {
    console.log('DATABASE_URL or GAME_ID not provided; only generated SQL preview.');
  }
}

process();
