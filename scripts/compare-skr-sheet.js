#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const sheetCsvUrl = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vRM_Eup9Efmo8PauK9mXO_GN7oRe2GzpO1fuob72bK_lcGqMeVFXVAeH4hIQ4mRA90OX8job4DGzQ3D/pub?output=csv';
const prunedDir = path.join(process.cwd(), 'data', 'seeds', 'pruned');
const reportDir = path.join(process.cwd(), 'report');
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);

async function fetchCsv(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();
    return txt;
  } catch (err) {
    return { error: String(err) };
  }
}

function parseCsv(csvText) {
  // Very small CSV parser: split lines, handle quoted commas simply
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { header: [], rows: [] };
  const header = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map(l => splitCsvLine(l)).map(cols => {
    const obj = {};
    for (let i=0;i<header.length;i++) obj[header[i].trim()] = (cols[i] || '').trim();
    return obj;
  });
  return { header, rows };
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i=0;i<line.length;i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function loadPrunedChars() {
  const file = path.join(prunedDir, 'seven-knights-rebirth.json');
  if (!fs.existsSync(file)) return { error: 'pruned characters file missing', path: file };
  const txt = fs.readFileSync(file,'utf8');
  return JSON.parse(txt);
}

(async function main(){
  console.log('Fetching sheet CSV...');
  const csv = await fetchCsv(sheetCsvUrl);
  const report = { meta: { sheetCsvUrl, timestamp: new Date().toISOString() }, errors: [], summary: {} };
  if (csv && csv.error) {
    report.errors.push({ type: 'sheet-fetch', message: csv.error });
  } else {
    const parsed = parseCsv(csv);
    report.sheet = { header: parsed.header, rowCount: parsed.rows.length };
    // heuristics: find slug column if present
    const slugCol = parsed.header.find(h => /slug/i.test(h)) || parsed.header.find(h => /id/i.test(h));
    const nameCol = parsed.header.find(h => /name/i.test(h)) || parsed.header[0];
    const sheetMap = new Map();
    parsed.rows.forEach(r => {
      const key = (r[slugCol] || r[nameCol] || '').toString().trim().toLowerCase();
      if (key) sheetMap.set(key, r);
    });
    report.sheetMapSize = sheetMap.size;

    // load pruned
    const pruned = loadPrunedChars();
    if (pruned && pruned.error) {
      report.errors.push(pruned);
    } else {
      report.prunedCount = pruned.length;
      const prunedMap = new Map();
      pruned.forEach(c => {
        const key = (c.slug || c.name || '').toString().trim().toLowerCase();
        if (key) prunedMap.set(key, c);
      });
      report.prunedMapSize = prunedMap.size;

      const missingInSheet = [];
      const missingInPruned = [];
      const differing = [];

      for (const [k,c] of prunedMap.entries()){
        if (!sheetMap.has(k)) missingInSheet.push({ slug: c.slug, name: c.name });
        else {
          const s = sheetMap.get(k);
          const sName = (s[nameCol]||'').trim();
          if (sName && sName !== c.name) differing.push({ slug: c.slug, name: c.name, sheetName: sName });
        }
      }
      for (const [k,s] of sheetMap.entries()){
        if (!prunedMap.has(k)) missingInPruned.push({ slugOrName: s[slugCol]||s[nameCol] });
      }

      report.summary = {
        missingInSheetCount: missingInSheet.length,
        missingInPrunedCount: missingInPruned.length,
        differingCount: differing.length
      };
      report.missingInSheet = missingInSheet.slice(0,50);
      report.missingInPruned = missingInPruned.slice(0,50);
      report.differing = differing.slice(0,50);
    }
  }

  const outPath = path.join(reportDir,'sheet-db-diff.json');
  fs.writeFileSync(outPath, JSON.stringify(report,null,2));
  console.log('Wrote report to', outPath);
})();
