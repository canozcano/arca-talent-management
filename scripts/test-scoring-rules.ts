/**
 * Automated tests for scoring rules (person-based only; no percentiles).
 * Run: npx tsx scripts/test-scoring-rules.ts
 *
 * Rules under test:
 * - User answers stored as 1..5.
 * - Reverse scoring: keyed "minus" => scored = 6 - stored_value; else stored_value (once).
 * - Factor bands from raw: 24–56 Low, 57–88 Average, 89–120 High.
 * - Facet bands from raw: 4–9 Low, 10–15 Average, 16–20 High.
 * - SDR bands from raw: 8–18 Low, 19–29 Average, 30–40 High.
 */

import {
    getFacetBand,
    getDomainBand,
    getSDRBand,
    computeScores,
    computeSDR,
} from '../lib/scoring-engine';
import items from '../data/items.tr.json';

const itemBank = items.map(({ id, domain, facet, keyed }) => ({ id, domain, facet, keyed: keyed as 'plus' | 'minus' }));

function allAnswers(value: number): Record<string, number> {
    const out: Record<string, number> = {};
    itemBank.forEach((item) => (out[item.id] = value));
    return out;
}

function withSDROverrides(answers: Record<string, number>, overrides: Record<string, number>): Record<string, number> {
    return { ...answers, ...overrides };
}

let passed = 0;
let failed = 0;

function ok(cond: boolean, msg: string) {
    if (cond) {
        passed++;
        console.log('  ✅', msg);
    } else {
        failed++;
        console.log('  ❌', msg);
    }
}

function eq<T>(a: T, b: T, msg: string) {
    ok(a === b, `${msg} (expected ${b}, got ${a})`);
}

console.log('--- Scoring rules test suite (person-based, raw bands) ---\n');

// --- Factor raw band boundaries: 24–56 Low, 57–88 Average, 89–120 High ---
console.log('1. Factor raw band boundaries');
eq(getDomainBand(24), 'Low', 'domain raw 24 → Low');
eq(getDomainBand(56), 'Low', 'domain raw 56 → Low');
eq(getDomainBand(57), 'Average', 'domain raw 57 → Average');
eq(getDomainBand(88), 'Average', 'domain raw 88 → Average');
eq(getDomainBand(89), 'High', 'domain raw 89 → High');
eq(getDomainBand(120), 'High', 'domain raw 120 → High');

// --- Facet raw band boundaries: 4–9 Low, 10–15 Average, 16–20 High ---
console.log('\n2. Facet raw band boundaries');
eq(getFacetBand(4), 'Low', 'facet raw 4 → Low');
eq(getFacetBand(9), 'Low', 'facet raw 9 → Low');
eq(getFacetBand(10), 'Average', 'facet raw 10 → Average');
eq(getFacetBand(15), 'Average', 'facet raw 15 → Average');
eq(getFacetBand(16), 'High', 'facet raw 16 → High');
eq(getFacetBand(20), 'High', 'facet raw 20 → High');

// --- SDR raw band boundaries: 8–18 Low, 19–29 Average, 30–40 High ---
console.log('\n3. SDR raw band boundaries');
eq(getSDRBand(8), 'Low', 'SDR raw 8 → Low');
eq(getSDRBand(18), 'Low', 'SDR raw 18 → Low');
eq(getSDRBand(19), 'Average', 'SDR raw 19 → Average');
eq(getSDRBand(29), 'Average', 'SDR raw 29 → Average');
eq(getSDRBand(30), 'High', 'SDR raw 30 → High');
eq(getSDRBand(40), 'High', 'SDR raw 40 → High');

// --- Reverse scoring: all 3 → raw 72 domain, 12 facet → Average ---
console.log('\n4. Reverse scoring (exactly once); neutral → Average');
const allThree = allAnswers(3);
const scoresNeutral = computeScores(allThree, itemBank);
eq(scoresNeutral.domains.N.raw, 72, 'All 3 → domain raw 72');
eq(scoresNeutral.domains.N.band, 'Average', '72 → Average');
eq(scoresNeutral.facets.N1.raw, 12, 'All 3 → facet raw 12');
eq(scoresNeutral.facets.N1.band, 'Average', '12 → Average');

// --- All 5 / All 1 → raw in range ---
const allFive = allAnswers(5);
const scoresHigh = computeScores(allFive, itemBank);
ok(scoresHigh.domains.N.raw >= 24 && scoresHigh.domains.N.raw <= 120, 'All 5 → domain raw in [24,120]');

const allOne = allAnswers(1);
const scoresLow = computeScores(allOne, itemBank);
ok(scoresLow.domains.N.raw >= 24 && scoresLow.domains.N.raw <= 120, 'All 1 → domain raw in [24,120]');

// --- SDR from main 120 items ---
console.log('\n5. SDR computed from items 39,41,45,51,75,81,101,109');
ok(scoresNeutral.sdr !== undefined, 'computeScores always returns sdr (from 120 items)');
const answersSdrLow = withSDROverrides(allThree, {
    item_39: 5, item_41: 5, item_75: 5, item_109: 5,
    item_45: 1, item_51: 1, item_81: 1, item_101: 1,
});
const scoresSdrLow = computeScores(answersSdrLow, itemBank);
eq(scoresSdrLow.sdr.raw, 8, 'SDR items min → raw 8');
eq(scoresSdrLow.sdr.band, 'Low', 'SDR raw 8 → Low');

const answersSdrHigh = withSDROverrides(allThree, {
    item_39: 1, item_41: 1, item_75: 1, item_109: 1,
    item_45: 5, item_51: 5, item_81: 5, item_101: 5,
});
const scoresSdrHigh = computeScores(answersSdrHigh, itemBank);
eq(scoresSdrHigh.sdr.raw, 40, 'SDR items max → raw 40');
eq(scoresSdrHigh.sdr.band, 'High', 'SDR raw 40 → High');

const sdr40 = computeSDR({
    item_39: 1, item_41: 1, item_75: 1, item_109: 1,
    item_45: 5, item_51: 5, item_81: 5, item_101: 5,
});
eq(sdr40.raw, 40, 'computeSDR 8×max → raw 40');
eq(sdr40.band, 'High', 'SDR 40 → High');

// --- Facet and domain raw ranges ---
console.log('\n6. Facet raw 4..20, Domain raw 24..120');
const minFacet = Math.min(...Object.values(scoresLow.facets).map((f) => f.raw));
const maxFacet = Math.max(...Object.values(scoresHigh.facets).map((f) => f.raw));
ok(minFacet >= 4 && maxFacet <= 20, `Facet raw in [4,20] (got min ${minFacet}, max ${maxFacet})`);
const minDom = Math.min(...Object.values(scoresLow.domains).map((d) => d.raw));
const maxDom = Math.max(...Object.values(scoresHigh.domains).map((d) => d.raw));
ok(minDom >= 24 && maxDom <= 120, `Domain raw in [24,120] (got min ${minDom}, max ${maxDom})`);

console.log('\n--- Summary ---');
console.log(`Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
