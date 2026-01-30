/**
 * Aynı sorular (IPIP-NEO-120), aynı cevaplar: ARCA + Referans + bigfive-test.com karşılaştırması.
 *
 * Çalıştırma:
 *   npx tsx scripts/compare-sources.ts [cevap-dosyası]
 *   npx tsx scripts/compare-sources.ts data/random-answers.json
 *   npx tsx scripts/compare-sources.ts data/generic-client-answers.json --bigfive 85,76,77,73,78
 *
 * bigfive-test.com skorlarını --bigfive O,C,E,A,N ile verebilir veya data/bigfive-scores.json kullanın.
 */

import fs from 'fs';
import path from 'path';
import { computeScores } from '../lib/scoring-engine';
import { referenceScoreDomains } from './reference-scorer';

const ITEMS_PATH = path.join(process.cwd(), 'data/items.tr.json');
const BIGFIVE_SCORES_PATH = path.join(process.cwd(), 'data/bigfive-scores.json');

type ItemRow = { id: string; domain: string; facet: number; keyed: string };

function main() {
    const args = process.argv.slice(2);
    let answersPath = path.join(process.cwd(), 'data/generic-client-answers.json');
    let bigfive: Record<string, number> | null = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--bigfive' && args[i + 1]) {
            const parts = args[i + 1].split(',').map((s) => parseInt(s.trim(), 10));
            if (parts.length >= 5) {
                bigfive = { O: parts[0], C: parts[1], E: parts[2], A: parts[3], N: parts[4] };
            }
            i++;
        } else if (!args[i].startsWith('--')) {
            answersPath = path.isAbsolute(args[i]) ? args[i] : path.join(process.cwd(), args[i]);
        }
    }

    if (!fs.existsSync(answersPath)) {
        console.error('Cevap dosyası bulunamadı:', answersPath);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(answersPath, 'utf-8'));
    const answers: Record<string, number> = data.answers || data;

    if (Object.keys(answers).length < 120) {
        console.warn('Uyarı: 120 cevap bekleniyor, bulunan:', Object.keys(answers).length);
    }

    const items = JSON.parse(fs.readFileSync(ITEMS_PATH, 'utf-8')) as ItemRow[];
    const itemBankForEngine = items.map(({ id, domain, facet, keyed }) => ({
        id,
        domain,
        facet,
        keyed: keyed as 'plus' | 'minus',
    }));

    const arcaScores = computeScores(answers, itemBankForEngine);
    const refScores = referenceScoreDomains(answers, items);

    if (!bigfive && fs.existsSync(BIGFIVE_SCORES_PATH)) {
        try {
            const bf = JSON.parse(fs.readFileSync(BIGFIVE_SCORES_PATH, 'utf-8'));
            bigfive = bf.domainTotals || bf;
        } catch (_) {}
    }

    const order = ['O', 'C', 'E', 'A', 'N'] as const;
    const arca = (d: string) => arcaScores.domains[d]?.raw ?? 0;
    const ref = (d: string) => refScores[d] ?? 0;
    const bf = (d: string) => (bigfive && bigfive[d]) ?? '–';

    console.log('--- Aynı sorular, aynı cevaplar: Kaynak karşılaştırması ---\n');
    console.log('Cevap dosyası:', answersPath);
    console.log('');
    console.log('| Faktör | ARCA (bizim) | Referans (resmi formül) | bigfive-test.com |');
    console.log('|--------|--------------|--------------------------|------------------|');

    for (const d of order) {
        const bfVal = bf(d);
        const bfStr = typeof bfVal === 'number' ? String(bfVal) : '–';
        console.log(`|   ${d}    |      ${String(arca(d)).padStart(3)}      |           ${String(ref(d)).padStart(3)}             |       ${bfStr.padStart(3)}        |`);
    }

    const arcaAvg = order.reduce((s, d) => s + arca(d), 0) / 5;
    const refAvg = order.reduce((s, d) => s + ref(d), 0) / 5;
    const bfNums = order.map((d) => bf(d)).filter((v): v is number => typeof v === 'number');
    const bfAvg = bfNums.length === 5 ? bfNums.reduce((s, v) => s + v, 0) / 5 : null;

    console.log('| ortalama |      ' + arcaAvg.toFixed(1) + '      |           ' + refAvg.toFixed(1) + '             |       ' + (bfAvg != null ? bfAvg.toFixed(1) : '–') + '        |');
    console.log('');

    if (arca('O') === ref('O') && arca('C') === ref('C') && arca('E') === ref('E') && arca('A') === ref('A') && arca('N') === ref('N')) {
        console.log('ARCA = Referans (resmi formül) uyumlu.');
    } else {
        console.log('Uyarı: ARCA ile Referans farklı; kontrol edin.');
    }

    if (!bigfive || bfNums.length < 5) {
        console.log('\nbigfive-test.com skorları: Aynı CEVAPLAR ile testi doldurup sonuç sayfasındaki O,C,E,A,N değerlerini');
        console.log('  data/bigfive-scores.json içine { "domainTotals": { "O": ..., "C": ..., "E": ..., "A": ..., "N": ... } }');
        console.log('  olarak kaydedin veya: npx tsx scripts/compare-sources.ts <cevap-dosyasi> --bigfive 85,76,77,73,78');
    }
}

main();
