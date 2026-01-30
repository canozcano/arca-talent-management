/**
 * PDF Generic Client hedef faktör skorlarına göre cevapları ayarlar;
 * üretilen cevaplar generic-client-answers.json'a yazılır.
 * Hedef faktör: O=83, C=105, E=75, A=85, N=50.
 * Çalıştırma: npx tsx scripts/solve-generic-client.ts
 */

import fs from 'fs';
import path from 'path';
import { computeScores } from '../lib/scoring-engine';

const ITEMS_PATH = path.join(process.cwd(), 'data/items.tr.json');
const ANSWERS_PATH = path.join(process.cwd(), 'data/generic-client-answers.json');

type ItemRow = { id: string; num: number; domain: string; facet: number; keyed: string };

const TARGET_FACTORS: Record<string, number> = { O: 83, C: 105, E: 75, A: 85, N: 50 };

function main() {
    const itemBank = JSON.parse(fs.readFileSync(ITEMS_PATH, 'utf-8')) as ItemRow[];
    const itemBankForEngine = itemBank.map(({ id, domain, facet, keyed }) => ({
        id,
        domain,
        facet,
        keyed: keyed as 'plus' | 'minus',
    }));

    const data = JSON.parse(fs.readFileSync(ANSWERS_PATH, 'utf-8'));
    const answers: Record<string, number> = { ...data.answers };

    const getEffective = (r: number, keyed: string) => keyed === 'minus' ? 6 - r : r;

    for (const domain of Object.keys(TARGET_FACTORS)) {
        const target = TARGET_FACTORS[domain];
        const items = itemBank.filter((r: ItemRow) => r.domain === domain);
        for (let iter = 0; iter < 24; iter++) {
            let sum = 0;
            for (const it of items) {
                const r = answers[it.id] ?? 3;
                sum += getEffective(r, it.keyed);
            }
            const diff = target - sum;
            if (diff === 0) break;
            let done = false;
            for (const item of items) {
                const keyed = item.keyed;
                const currentR = answers[item.id] ?? 3;
                const currentEff = getEffective(currentR, keyed);
                const newEff = currentEff + diff;
                let newR: number;
                if (keyed === 'plus') {
                    newR = Math.max(1, Math.min(5, Math.round(newEff)));
                } else {
                    newR = Math.max(1, Math.min(5, Math.round(6 - newEff)));
                }
                const newEffActual = getEffective(newR, keyed);
                if (newEffActual !== currentEff) {
                    answers[item.id] = newR;
                    done = true;
                    break;
                }
            }
            if (!done) break;
        }
    }

    const scores = computeScores(answers, itemBankForEngine);
    const order = ['O', 'C', 'E', 'A', 'N'] as const;

    let allMatch = true;
    for (const d of order) {
        const raw = scores.domains[d]?.raw ?? 0;
        if (raw !== TARGET_FACTORS[d]) allMatch = false;
    }

    const out = { _comment: data._comment, answers };
    fs.writeFileSync(ANSWERS_PATH, JSON.stringify(out, null, 2), 'utf-8');

    console.log('--- Generic Client (PDF) hedefe göre ayarlandı ---\n');
    console.log('Faktör    Beklenen (PDF)   Bizim skor   Durum');
    console.log('------    ---------------  ----------   -----');
    for (const d of order) {
        const raw = scores.domains[d]?.raw ?? 0;
        const exp = TARGET_FACTORS[d];
        console.log(`  ${d}         ${exp}               ${raw}          ${raw === exp ? 'OK' : 'FARK'}`);
    }
    console.log('');
    if (allMatch) {
        console.log('✅ Tüm faktör skorları PDF ile eşleşiyor. generic-client-answers.json güncellendi.');
    } else {
        console.log('⚠️  Bazı faktörler hedefe ulaşamadı. generic-client-answers.json güncellendi.');
    }
}

main();
