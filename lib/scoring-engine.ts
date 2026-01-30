// --- IPIP-NEO-120 SCORING ENGINE (person-based only; no community percentiles) ---
// Rules:
// 1. Raw scores only; no percentile/norm comparison for now.
// 2. Reverse keying: score = 6 - answer.
// 3. Factor/Facet bands from raw score ranges (tertiles): person-based only.
// 4. SDR bands from raw score ranges (tertiles).
// 5. SDR items: 39, 41, 45, 51, 75, 81, 101, 109 (from main 120); does not affect factor/facet scores.

export type Item = {
    id: string;
    domain: string;
    facet: number;
    keyed: 'plus' | 'minus';
};

export type Band = 'Low' | 'Average' | 'High';

export type ScoreResult = {
    raw: number;
    band: Band;
};

export type Scores = {
    domains: Record<string, ScoreResult>;
    facets: Record<string, ScoreResult>;
    sdr: ScoreResult;
    patterns: PatternResult[];
};

export type PatternResult = {
    key: string;
    name: string;
    description: string;
};

// --- RAW-SCORE BANDING (person-based; no percentiles) ---
// Factor: raw 24–120 → Low 24–56, Average 57–88, High 89–120 (tertiles of range).
export function getBandFromRawFactor(raw: number): Band {
    if (raw >= 89) return 'High';
    if (raw > 56) return 'Average';
    return 'Low';
}

// Facet: raw 4–20 → Low 4–9, Average 10–15, High 16–20.
export function getBandFromRawFacet(raw: number): Band {
    if (raw >= 16) return 'High';
    if (raw > 9) return 'Average';
    return 'Low';
}

// SDR: raw 8–40 → Low 8–18, Average 19–29, High 30–40.
export function getBandFromRawSDR(raw: number): Band {
    if (raw >= 30) return 'High';
    if (raw > 18) return 'Average';
    return 'Low';
}

// Legacy exports for tests (raw-based).
export function getFacetBand(raw: number): Band {
    return getBandFromRawFacet(raw);
}

export function getDomainBand(raw: number): Band {
    return getBandFromRawFactor(raw);
}

export function getSDRBand(raw: number): Band {
    return getBandFromRawSDR(raw);
}

// --- SCORING LOGIC ---

export function computeSDR(answers: Record<string, number>): ScoreResult {
    // SDR Items: 39, 41, 45, 51, 75, 81, 101, 109 (NovoPsych)
    // Logic: Reverse (39, 41, 75, 109), Direct (45, 51, 81, 101)

    const reverseIds = ['item_39', 'item_41', 'item_75', 'item_109'];
    const directIds = ['item_45', 'item_51', 'item_81', 'item_101'];

    let raw = 0;

    reverseIds.forEach(id => {
        const val = answers[id];
        if (typeof val === 'number') {
            raw += 6 - val;
        } else {
            raw += 3; // Default
        }
    });

    directIds.forEach(id => {
        const val = answers[id];
        if (typeof val === 'number') {
            raw += val;
        } else {
            raw += 3; // Default
        }
    });

    return {
        raw,
        band: getBandFromRawSDR(raw),
    };
}

// --- PATTERN LOGIC (AB5C) ---
import patternsData from '@/data/patterns.tr.json';

const PATTERN_PAIRS = [
    ['E', 'A'], ['E', 'C'], ['E', 'N'], ['E', 'O'],
    ['A', 'C'], ['A', 'N'], ['A', 'O'],
    ['C', 'N'], ['C', 'O'],
    ['N', 'O']
];

export function getPatterns(domains: Record<string, ScoreResult>): PatternResult[] {
    const results: PatternResult[] = [];
    const patternsMap = patternsData.patternsByKey as Record<string, any>;

    PATTERN_PAIRS.forEach(([d1, d2]) => {
        const band1 = domains[d1].band;
        const band2 = domains[d2].band;

        // Pattern exists only if BOTH are NOT Average (i.e., High or Low)
        if (band1 !== 'Average' && band2 !== 'Average') {
            const key = `${d1}:${d2}:${band1}:${band2}`;
            const p = patternsMap[key];
            if (p) {
                results.push({
                    key: p.key,
                    name: p.name,
                    description: p.descriptionTr
                });
            }
        }
    });

    return results;
}

// Removing demographics param as norms are removed
export function computeScores(answers: Record<string, number>, itemBank: Item[]): Scores {
    const domains: Record<string, number> = { N: 0, E: 0, O: 0, A: 0, C: 0 };
    const facets: Record<string, number> = {};

    // Initialize facet scores
    itemBank.forEach(item => {
        facets[`${item.domain}${item.facet}`] = 0;
    });

    // Calculate Raw Scores
    itemBank.forEach(item => {
        const userVal = answers[item.id];

        // Ensure strictly 1-5 integer provided
        if (typeof userVal === 'number' && userVal >= 1 && userVal <= 5) {

            // USER REQUEST (2026-01-30): "Biz pdf dekinin aynısını yapacağız... toplama işlemleri ile"
            // The PDF's "Developer Reference" scores are simple sums without reverse keying.
            // We switch to simple summation to match this expectation.
            // REVERSE LOGIC DISABLED:
            // const effectiveScore = item.keyed === 'minus' ? (6 - userVal) : userVal;
            const effectiveScore = userVal;

            domains[item.domain] = (domains[item.domain] || 0) + effectiveScore;
            facets[`${item.domain}${item.facet}`] = (facets[`${item.domain}${item.facet}`] || 0) + effectiveScore;
        }
    });

    const result: Scores = {
        domains: {} as any,
        facets: {} as any,
        sdr: computeSDR(answers),
        patterns: [],
    };

    // Person-based only: raw scores + raw-based bands (no percentiles)
    for (const d of Object.keys(domains)) {
        const raw = domains[d];
        result.domains[d] = {
            raw,
            band: getBandFromRawFactor(raw),
        };
    }

    for (const f of Object.keys(facets)) {
        const raw = facets[f];
        result.facets[f] = {
            raw,
            band: getBandFromRawFacet(raw),
        };
    }

    // Calculate Patterns
    result.patterns = getPatterns(result.domains);

    return result;
}
