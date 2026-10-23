// Reads docs/redirect-inventory.csv, the one place redirects are edited. Plain CommonJS so next.config.js and the tests share it.
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'docs', 'redirect-inventory.csv');

// Minimal CSV: commas, double-quoted fields, "" for a quote inside a field.
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some((c) => c !== '')) rows.push(row); row = []; }
    else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const loadRows = (file = FILE) => parseCsv(fs.readFileSync(file, 'utf8'));
// Only rows typed 301 or 302 become redirects. keep / 404 / 410 rows are documentation.
const redirectRows = (rows) => rows.filter((r) => r.redirect_type === '301' || r.redirect_type === '302');
const toNextRedirects = (rows) => redirectRows(rows).map((r) => ({ source: r.old_url, destination: r.new_destination, statusCode: Number(r.redirect_type) }));

module.exports = { parseCsv, loadRows, redirectRows, toNextRedirects, FILE };
