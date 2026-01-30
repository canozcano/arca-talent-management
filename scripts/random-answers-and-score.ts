/**
 * Rastgele 120 cevap (1–5) üretir, bizim motorla skorlar; bigfive-test.com ile
 * ortalama karşılaştırması için aynı cevapları kullanabilirsiniz.
 *
 * Çalıştırma: npx tsx scripts/random-answers-and-score.ts
 * İsteğe bağlı seed: npx tsx scripts/random-answers-and-score.ts 12345
 */

import fs from 'fs';
import path from 'path';
import { computeScores } from '../lib/scoring-engine';

const ITEMS_PATH = path.join(process.cwd(), 'data/items.tr.json');
const OUT_PATH = path.join(process.cwd(), 'data/random-answers.json');

type ItemRow = { id: string; domain: string; facet: number; keyed: string };

function seededRandom(seed: number) {
    let s = seed;
    return function () {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function main() {
    const seedArg = process.argv[2];
    const seed = seedArg ? parseInt(seedArg, 10) || 0 : Date.now();
    const rng = seededRandom(seed);

    const itemBank = JSON.parse(fs.readFileSync(ITEMS_PATH, 'utf-8')) as ItemRow[];
    const itemBankForEngine = itemBank.map(({ id, domain, facet, keyed }) => ({
        id,
        domain,
        facet,
        keyed: keyed as 'plus' | 'minus',
    }));

    const CEVAPLAR: number[] = [];
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 120; i++) {
        const v = 1 + Math.floor(rng() * 5);
        CEVAPLAR.push(v);
        answers[`item_${i}`] = v;
    }

    const scores = computeScores(answers, itemBankForEngine);
    const order = ['O', 'C', 'E', 'A', 'N'] as const;
    const ourScores: Record<string, number> = {};
    for (const d of order) {
        ourScores[d] = scores.domains[d]?.raw ?? 0;
    }

    const out = {
        _comment: 'Rastgele 120 cevap; bizim skorlar vs bigfive-test.com karşılaştırması için.',
        seed,
        answers,
        CEVAPLAR,
        ourScores,
    };

    fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');

    console.log('--- Rastgele cevaplar + bizim skorlar ---\n');
    console.log('Seed:', seed);
    console.log('\nBizim program (ARCA) skorları:');
    console.log('  O =', ourScores.O, '  C =', ourScores.C, '  E =', ourScores.E, '  A =', ourScores.A, '  N =', ourScores.N);
    console.log('\nOrtalama (faktör başına 24 madde, 1–5): beklenen ~72 (24*3).');
    console.log('  Bizim ortalama:', ((ourScores.O + ourScores.C + ourScores.E + ourScores.A + ourScores.N) / 5).toFixed(1));
    console.log('\nKaydedildi:', OUT_PATH);
    console.log('\nCEVAPLAR (fill script\'te kullanmak için tek satır):');
    console.log(JSON.stringify(CEVAPLAR));
    console.log('\nKarşılaştırma:');
    console.log('  1) bigfive-test.com/tr/test açın.');
    console.log('  2) bigfive-test-com-fill-console.js içindeki CEVAPLAR dizisini yukarıdaki ile değiştirip konsola yapıştırın.');
    console.log('  3) Testi doldurun; sonuç sayfasındaki O,C,E,A,N ile bizim skorları (yukarıda) yan yana koyun.');
}

main();
