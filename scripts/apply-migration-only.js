// Apply migration 0005 only (no seed)
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function apply(pgUrl) {
  const sqlPath = path.join(__dirname, '..', 'db', 'migrations', '0005_add_pet_id_to_tier_entries.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Migration file not found:', sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
  try {
    console.log('Connecting to Postgres...');
    await client.connect();
    console.log('Applying migration...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration applied successfully.');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (e) {}
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

const url = process.argv[2] || process.env.POSTGRES_URL;
if (!url) {
  console.error('Usage: node scripts/apply-migration-only.js <POSTGRES_URL>');
  process.exit(1);
}
apply(url).catch(err => { console.error(err); process.exit(1); });
