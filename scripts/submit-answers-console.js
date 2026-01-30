#!/usr/bin/env node
/**
 * PDF Generic Client (developer test) cevaplarını API'ye gönderip sonuç sayfasına yönlendirir.
 * Cevaplar data/generic-client-answers.json'dan okunur; bu set O=83, C=105, E=75, A=85, N=50 üretir.
 * Kullanım:
 *   node scripts/submit-answers-console.js
 * Çıktıyı kopyalayıp tarayıcıda test sayfasındayken (örn. http://localhost:3000/test) F12 > Console'a yapıştırıp Enter'a basın.
 * Alternatif: node scripts/submit-answers-console.js --curl
 */

const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'data', 'generic-client-answers.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const answers = data.answers;

const payload = {
  answers,
  demographics: { age: 25, sex: 'Male' },
  timestamp: new Date().toISOString()
};

const useCurl = process.argv.includes('--curl');

if (useCurl) {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  console.log('curl -X POST "' + base + '/api/submit" -H "Content-Type: application/json" -d \'' + JSON.stringify(payload) + "'");
  process.exit(0);
}

// Tarayıcı konsolunda çalıştırılacak tek satır
const oneLiner = `fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(${JSON.stringify(payload)})}).then(r=>r.json()).then(d=>{if(d.id)window.location.href="/results/"+d.id;else console.error("Hata:",d);}).catch(e=>console.error(e));`;

console.log('--- Tarayıcı konsolunda test sayfasındayken (örn. /test) aşağıdaki kodu yapıştırıp Enter\'a basın ---\n');
console.log(oneLiner);
console.log('\n--- Yukarıdaki kodu kopyalayıp F12 > Console\'a yapıştırın. Sonuç sayfasına yönlendirileceksiniz. ---');
