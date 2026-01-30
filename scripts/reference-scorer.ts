/**
 * Referans skorlayıcı: IPIP-NEO-120 resmi formül (domain toplamları).
 * Bağımsız, minimal; ARCA motoru ile karşılaştırma için.
 * Formül: Her madde için effectiveScore = keyed === 'minus' ? (6 - cevap) : cevap; domain toplamı.
 */

import fs from 'fs';
import path from 'path';

const ITEMS_PATH = path.join(process.cwd(), 'data/items.tr.json');

type ItemRow = { id: string; domain: string; facet: number; keyed: string };

export function referenceScoreDomains(answers: Record<string, number>, items: ItemRow[]): Record<string, number> {
    const domains: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    for (const item of items) {
        const val = answers[item.id];
        if (typeof val !== 'number' || val < 1 || val > 5) continue;
        const effective = item.keyed === 'minus' ? 6 - val : val;
        domains[item.domain] = (domains[item.domain] || 0) + effective;
    }
    return domains;
}

function main() {
    const answersPath = process.argv[2] || path.join(process.cwd(), 'data/generic-client-answers.json');
    const data = JSON.parse(fs.readFileSync(answersPath, 'utf-8'));
    const answers: Record<string, number> = data.answers || data;

    const items = JSON.parse(fs.readFileSync(ITEMS_PATH, 'utf-8')) as ItemRow[];
    const scores = referenceScoreDomains(answers, items);

    console.log('Referans skorlayıcı (resmi formül):');
    console.log('  O =', scores.O, '  C =', scores.C, '  E =', scores.E, '  A =', scores.A, '  N =', scores.N);
}

if (process.argv[1]?.includes('reference-scorer')) main();
