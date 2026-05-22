const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SHEET_ID = '2PACX-1vRM_Eup9Efmo8PauK9mXO_GN7oRe2GzpO1fuob72bK_lcGqMeVFXVAeH4hIQ4mRA90OX8job4DGzQ3D';
const PUBHTML_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pubhtml`;
const rawDir = path.join(__dirname, '..', 'data', 'seeds', 'raw');

function fetchViaPS(url) {
  const cmd = `powershell -NoProfile -NonInteractive -Command "& { [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; $r = Invoke-WebRequest -Uri '${url}' -UseBasicParsing; Write-Output $r.Content }"`;
  return execSync(cmd, { timeout: 120000, stdio: 'pipe', encoding: 'utf8' }).trim();
}

function downloadViaPS(url, filepath) {
  const cmd = `powershell -NoProfile -NonInteractive -Command "& { Invoke-WebRequest -Uri '${url}' -OutFile '${filepath}' -UseBasicParsing }"`;
  execSync(cmd, { timeout: 120000, stdio: 'pipe' });
}

function extractTabs(html) {
  const regex = /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:\s*"[^"]+",\s*gid:\s*"(\d+)"[^}]*\}\)/g;
  const tabs = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const name = match[1]
      .replace(/\\x26/g, '&')
      .replace(/\\\//g, '/')
      .replace(/\\"/g, '"');
    tabs.push({ name, gid: match[2] });
  }
  return tabs;
}

function normalizeTabName(name) {
  const explicit = {
    'Hero_Attack': 'build-attack',
    'Hero_Magic': 'build-magic',
    'Hero_Defense': 'build-defense',
    'Hero_Support': 'build-support',
    'Hero_Universal': 'build-universal',
    'Hero_RARE': 'build-rare',
    'L++': 'roster-l++',
    'L+': 'roster-l+',
    'L': 'roster-l',
    'R': 'roster-r',
    'Collab': 'roster-collab',
  };
  if (explicit[name]) return explicit[name];
  return name
    .replace(/&/g, '-and-')
    .replace(/[^a-zA-Z0-9+]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function getCSVFilename(tab) {
  return `seven-knights-rebirth-${normalizeTabName(tab.name)}.csv`;
}

function main() {
  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

  console.log('Fetching pubhtml for tab discovery...');
  const html = fetchViaPS(PUBHTML_URL);
  const tabs = extractTabs(html);
  console.log(`Discovered ${tabs.length} tabs\n`);

  let downloaded = 0;
  let skipped = 0;

  for (const tab of tabs) {
    const filename = getCSVFilename(tab);
    const filepath = path.join(rawDir, filename);

    if (fs.existsSync(filepath)) {
      const size = fs.statSync(filepath).size;
      console.log(`  SKIP ${tab.name} → ${filename} (${size} bytes, exists)`);
      skipped++;
      continue;
    }

    const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${tab.gid}&single=true&output=csv`;
    process.stdout.write(`  DL ${tab.name} (gid=${tab.gid}) → ${filename} ... `);

    try {
      downloadViaPS(url, filepath);
      const size = fs.statSync(filepath).size;
      console.log(`${size} bytes`);
      downloaded++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  console.log(`\nDone. ${downloaded} downloaded, ${skipped} skipped, ${tabs.length} total tabs.`);
}

main();
