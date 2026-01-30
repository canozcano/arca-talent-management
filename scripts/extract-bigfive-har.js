/**
 * HAR dosyasından bigfive-test.com sonuç sayfasındaki skorları çıkarır.
 * Kullanım: node scripts/extract-bigfive-har.js /path/to/bigfive-test.com.har
 *
 * Not: Sonuç sayfası yanıtında ham 120 cevap (answers) YOK; sadece hesaplanmış
 * domain/facet skorları HTML/RSC içinde geliyor. Test gönderilirken (POST) yapılan
 * istek HAR'da yoksa cevapları bu dosyadan çıkaramayız.
 */

const fs = require('fs');
const path = require('path');

const harPath = process.argv[2] || path.join(process.env.HOME || '', 'Downloads/bigfive-test.com.har');
if (!fs.existsSync(harPath)) {
  console.error('HAR dosyası bulunamadı:', harPath);
  process.exit(1);
}

const har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
const entries = har.log?.entries || [];
const resultEntry = entries.find(e => (e.request?.url || '').includes('result/697ca45') && (e.request?.url || '').includes('bigfive-test.com'));
const html = resultEntry?.response?.content?.text || '';

if (!html) {
  console.error('Result sayfası yanıtı HAR\'da bulunamadı.');
  process.exit(1);
}

// RSC/HTML içinde "score":N pattern'leri (escape'li)
const scoreMatches = [];
const re = /\\\"score\\\":(\d+)/g;
let m;
while ((m = re.exec(html)) !== null) scoreMatches.push(parseInt(m[1], 10));

// Bilinen yapı: 6 facet + 1 domain toplamı per domain (N,E,O,A,C) → 7*5 = 35, artı tekrarlar
const facetScores = [];
const domainTotals = { N: null, E: null, O: null, A: null, C: null };
let idx = 0;
const order = ['N', 'E', 'O', 'A', 'C'];
for (const dom of order) {
  let sum = 0;
  for (let i = 0; i < 6 && idx < scoreMatches.length; i++) {
    facetScores.push(scoreMatches[idx]);
    sum += scoreMatches[idx];
    idx++;
  }
  if (idx < scoreMatches.length) {
    const total = scoreMatches[idx];
    domainTotals[dom] = total;
    idx++;
  }
}

console.log('--- bigfive-test.com HAR\'dan çıkarılan skorlar ---\n');
console.log('Domain toplamları (HAR):', domainTotals);
console.log('\nİlk 30 skor değeri (facet + domain):', scoreMatches.slice(0, 30));
console.log('\n⚠️  Ham 120 cevap (answers) bu HAR\'da YOK.');
console.log('   Sonuç sayfası sadece hesaplanmış skorları döndürüyor; cevaplar sunucuda kalıyor.');
console.log('   Cevapları görmek için: testi gönderirken (SONRAKİ son tıklama) Network\'ta POST isteğini kaydedin.');

const outPath = path.join(process.cwd(), 'data', 'bigfive-har-scores.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({
  source: 'bigfive-test.com.har',
  resultId: '697ca45249702b50cc4e3e22',
  domainTotals,
  allScoreValues: scoreMatches,
  note: 'Raw 120 answers are not in the result page response.',
}, null, 2), 'utf8');
console.log('\nSkorlar kaydedildi:', outPath);
