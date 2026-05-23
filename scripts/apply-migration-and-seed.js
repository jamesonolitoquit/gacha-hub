// Apply migration SQL to Postgres then run seed-supabase.js
// Usage: node scripts/apply-migration-and-seed.js <POSTGRES_URL>

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

async function applyMigration(pgUrl) {
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
    console.log('Connected. Applying migration...');
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

async function runSeed() {
  console.log('\nRunning seed script (node scripts/seed-supabase.js')
  const res = spawnSync(process.execPath, [path.join(__dirname, 'seed-supabase.js')], { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  if (res.error) {
    console.error('Failed to run seed script:', res.error);
    process.exit(1);
  }
  if (res.status !== 0) {
    console.error('Seed script exited with code', res.status);
    process.exit(res.status);
  }
}

async function main() {
  const argUrl = process.argv[2] || process.env.POSTGRES_URL;
  if (!argUrl) {
    console.error('Usage: node scripts/apply-migration-and-seed.js <POSTGRES_URL>');
    process.exit(1);
  }
  await applyMigration(argUrl);
  await runSeed();
  console.log('\nAll done.');
}

main();
