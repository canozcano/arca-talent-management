/**
 * PDF Generic Client cevaplarıyla skorlama yapar; beklenen faktör skorlarıyla karşılaştırır.
 * Beklenen (PDF): O=83, C=105, E=75, A=85, N=50
 * Çalıştırma: npx tsx scripts/run-generic-client.ts
 */

import fs from 'fs';
import path from 'path';
import { computeScores } from '../lib/scoring-engine';

const ITEMS_PATH = path.join(process.cwd(), 'data/items.tr.json');
const ANSWERS_PATH = path.join(process.cwd(), 'data/generic-client-answers.json');

type ItemRow = { id: string; domain: string; facet: number; keyed: string };

function main() {
    const itemBank = JSON.parse(fs.readFileSync(ITEMS_PATH, 'utf-8')) as ItemRow[];
    const itemBankForEngine = itemBank.map(({ id, domain, facet, keyed }) => ({
        id,
        domain,
        facet,
        keyed: keyed as 'plus' | 'minus',
    }));

    const data = JSON.parse(fs.readFileSync(ANSWERS_PATH, 'utf-8'));
    const answers: Record<string, number> = data.answers;

    const scores = computeScores(answers, itemBankForEngine);

    const expected: Record<string, number> = { O: 83, C: 105, E: 75, A: 85, N: 50 };
    const order = ['O', 'C', 'E', 'A', 'N'] as const;

    console.log('--- Generic Client (PDF) cevaplarıyla skorlama ---\n');
    console.log('Faktör    Beklenen (PDF)   Bizim skor   Durum');
    console.log('------    ---------------  ----------   -----');

    let allMatch = true;
    for (const d of order) {
        const raw = scores.domains[d]?.raw ?? 0;
        const exp = expected[d] ?? 0;
        const ok = raw === exp;
        if (!ok) allMatch = false;
        console.log(`  ${d}         ${exp}               ${raw}          ${ok ? 'OK' : 'FARK'}`);
    }

    console.log('');
    if (allMatch) {
        console.log('✅ Tüm faktör skorları PDF ile eşleşiyor.');
    } else {
        console.log('⚠️  Bazı skorlar PDF ile farklı. Cevapların 1–120 sırası ve reverse keying kontrol edilmeli.');
    }
}

main();
