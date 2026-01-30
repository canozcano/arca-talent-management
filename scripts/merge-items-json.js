/**
 * Reads a 120-item JSON array from file or stdin (id, text, keyed, domain, facet)
 * and writes data/items.tr.json with id item_1..item_120, num, text_tr, domain, facet, keyed.
 * Usage: node scripts/merge-items-json.js [input.json]
 * Or: node scripts/merge-items-json.js < input.json
 */
const fs = require('fs');
const path = require('path');

function run(raw) {
  if (!Array.isArray(raw) || raw.length !== 120) {
    console.error('Expected JSON array of 120 items, got', Array.isArray(raw) ? raw.length : typeof raw);
    process.exit(1);
  }
  const out = raw.map((item, i) => ({
    num: i + 1,
    id: `item_${i + 1}`,
    text_tr: (item.text || item.text_tr || '').trim(),
    domain: item.domain,
    facet: item.facet,
    keyed: item.keyed,
  }));
  const outPath = path.join(process.cwd(), 'data', 'items.tr.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', outPath, 'with', out.length, 'items');
}

const file = process.argv[2];
if (file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  run(raw);
} else {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', () => {
    run(JSON.parse(input));
  });
}
