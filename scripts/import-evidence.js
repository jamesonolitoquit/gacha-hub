/**
 * import-evidence.js
 *
 * CLI tool to import evidence records from a JSON file.
 * Usage: node scripts/import-evidence.js --game <slug> --file ./evidence/batch.json
 *
 * JSON format:
 * [
 *   {
 *     "sourceUrl": "https://example.com/screenshot.png",
 *     "sourceHash": "sha256-...",
 *     "evidenceType": "screenshot",
 *     "claimType": "character_stat",
 *     "extractedData": { "characterName": "Sword Knight" },
 *     "aiModel": "manual"
 *   }
 * ]
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';

function parseArgs() {
  const args = process.argv.slice(2);
  const game = args[args.indexOf('--game') + 1] ?? args[args.indexOf('-g') + 1] ?? null;
  const file = args[args.indexOf('--file') + 1] ?? args[args.indexOf('-f') + 1] ?? null;

  if (!game || !file) {
    console.error('Usage: node scripts/import-evidence.js --game <slug> --file <path>');
    console.error('  -g, --game    Game slug (e.g. seven-knights-rebirth)');
    console.error('  -f, --file    Path to JSON file containing evidence array');
    process.exit(1);
  }

  return { game, file: path.resolve(file) };
}

async function getGameId(supabase, slug) {
  const { data, error } = await supabase
    .from('games')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to look up game: ${error.message}`);
  if (!data) throw new Error(`Game not found: ${slug}`);

  return data.id;
}

async function main() {
  const { game, file } = parseArgs();

  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    process.exit(1);
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let records;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    records = JSON.parse(raw);

    if (!Array.isArray(records)) {
      throw new Error('Input must be an array');
    }
  } catch (err) {
    console.error(`Failed to parse ${file}:`, err.message);
    process.exit(1);
  }

  const gameId = await getGameId(supabase, game);
  console.log(`Game ID for "${game}": ${gameId}`);
  console.log(`\nProcessing ${records.length} evidence record(s)...\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const record of records) {
    if (!record.sourceUrl) {
      console.error(`  ✖  Skipping: missing sourceUrl`);
      errors++;
      continue;
    }

    if (record.sourceHash) {
      const { data: existing } = await supabase
        .from('evidence')
        .select('id')
        .eq('source_hash', record.sourceHash)
        .is('deleted_at', null)
        .maybeSingle();

      if (existing) {
        console.log(`  ○  Skipped (duplicate hash): ${record.sourceUrl}`);
        skipped++;
        continue;
      }
    }

    const { error } = await supabase.from('evidence').insert({
      evidence_type: record.evidenceType ?? 'screenshot',
      source_url: record.sourceUrl,
      source_hash: record.sourceHash ?? null,
      extracted_data: record.extractedData ? JSON.stringify(record.extractedData) : null,
      confidence_score: record.confidenceScore ?? null,
      ai_model: record.aiModel ?? null,
      game_id: gameId,
      patch_id: record.patchId ?? null,
      claim_type: record.claimType ?? null,
      is_verified: record.isVerified ?? false,
      verified_by: record.verifiedBy ?? null,
      verification_notes: record.verificationNotes ?? null,
    });

    if (error) {
      console.error(`  ✖  Error: ${record.sourceUrl} — ${error.message}`);
      errors++;
    } else {
      console.log(`  ✓  Imported: ${record.sourceUrl}`);
      imported++;
    }
  }

  console.log(`\nDone: ${imported} imported, ${skipped} skipped, ${errors} errors`);
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
