const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(process.cwd(), 'data', 'items.tr.json');

// First 10 items (Official TR)
const first10 = [
    "Her şeye endişelenirim.",
    "Kolay arkadaş edinirim.",
    "Geniş bir hayal gücüne sahibim.",
    "Başkalarına güvenirim.",
    "Görevleri başarıyla tamamlarım.",
    "Çabuk sinirlenirim.",
    "Sosyal faaliyetleri severim.",
    "Sanatın önemine inanırım.",
    "Başkalarından kendi amaçlarım için yararlanırım.",
    "Düzenli olmayı severim."
];

// Keying Logic (Source: IPIP-NEO-120 Short Form keys)
// R denotes Reverse (minus). Otherwise Plus.
// Arrays of item numbers for each Facet (1-6) within Domain.
const MAP = {
    N: [
        [1, 31, 61, 91],          // N1: Anxiety (All +)
        [6, 36, 66, '96R'],       // N2: Anger (96R)
        [11, 41, 71, 101],        // N3: Depression (All +)
        [16, 46, '76R', '106R'],  // N4: Self-Consciousness
        [21, 51, '81R', '111R'],  // N5: Immoderation
        [26, 56, 86, '116R']      // N6: Vulnerability (116R)
    ],
    E: [
        [2, 32, '62R', '92R'],    // E1: Friendliness
        [7, 37, '67R', '97R'],    // E2: Gregariousness
        [12, 42, 72, '102R'],     // E3: Assertiveness
        [17, 47, 77, '107R'],     // E4: Activity
        [22, 52, 82, 112],        // E5: Excitement-Seeking
        [27, 57, 87, 117]         // E6: Cheerfulness
    ],
    O: [
        [3, 33, 63, 93],          // O1: Imagination
        [8, 38, '68R', '98R'],    // O2: Artistic Interests
        [13, 43, '73R', '103R'],  // O3: Emotionality
        [18, '48R', '78R', '108R'], // O4: Adventurousness
        [23, '53R', '83R', '113R'], // O5: Intellect
        [28, 58, '88R', '118R']   // O6: Liberalism
    ],
    A: [
        [4, 34, 64, '94R'],       // A1: Trust
        ['9R', '39R', '69R', '99R'], // A2: Morality
        [14, 44, '74R', '104R'],  // A3: Altruism
        ['19R', '49R', '79R', '109R'], // A4: Cooperation
        ['24R', '54R', '84R', '114R'], // A5: Modesty
        [29, 59, '89R', '119R']   // A6: Sympathy
    ],
    C: [
        [5, 35, 65, 95],          // C1: Self-Efficacy
        [10, '40R', '70R', '100R'], // C2: Orderliness
        [15, 45, '75R', '105R'],  // C3: Dutifulness
        [20, 50, '80R', '110R'],  // C4: Achievement-Striving
        [25, 55, '85R', '115R'],  // C5: Self-Discipline
        ['30R', '60R', '90R', '120R'] // C6: Cautiousness
    ]
};

const items = [];
const itemMap = new Map(); // For validation uniqueness

// Generate items
['N', 'E', 'O', 'A', 'C'].forEach(domain => {
    MAP[domain].forEach((itemNums, facetIdx) => {
        const facet = facetIdx + 1;
        itemNums.forEach(entry => {
            let numStr = String(entry);
            let keyed = 'plus';
            if (numStr.endsWith('R')) {
                keyed = 'minus';
                numStr = numStr.slice(0, -1);
            }
            const num = parseInt(numStr, 10);
            const text = num <= 10 ? first10[num - 1] : `(Geçici) Soru ${num}`;

            const item = {
                num,
                id: `q${String(num).padStart(3, '0')}`,
                text_tr: text,
                domain,
                facet,
                keyed
            };
            items.push(item);
            itemMap.set(num, item);
        });
    });
});

// Sort by num
items.sort((a, b) => a.num - b.num);

// Write File
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(items, null, 2));
console.log(`Generated ${items.length} items in ${OUTPUT_PATH}`);

// Validation
console.log('\n--- VALIDATION ---');
let errors = 0;
if (items.length !== 120) {
    console.error(`Error: Expected 120 items, got ${items.length}`);
    errors++;
}

const domains = { N: 0, E: 0, O: 0, A: 0, C: 0 };
const facets = {}; // 'N1': 4

items.forEach(item => {
    domains[item.domain]++;
    const fKey = `${item.domain}${item.facet}`;
    facets[fKey] = (facets[fKey] || 0) + 1;
});

Object.entries(domains).forEach(([d, count]) => {
    if (count !== 24) {
        console.error(`Error: Domain ${d} has ${count} items (expected 24)`);
        errors++;
    }
});

let missingFacets = 0;
['N', 'E', 'O', 'A', 'C'].forEach(d => {
    for (let f = 1; f <= 6; f++) {
        const key = `${d}${f}`;
        if (facets[key] !== 4) {
            console.error(`Error: Facet ${key} has ${facets[key] || 0} items (expected 4)`);
            errors++;
        }
    }
});

// Check gaps
for (let i = 1; i <= 120; i++) {
    if (!items.find(x => x.num === i)) {
        console.error(`Error: Missing item number ${i}`);
        errors++;
    }
}

if (errors === 0) {
    console.log('✅ Validation Passed: 120 items, 24 per domain, 4 per facet.');
} else {
    console.error(`❌ Validation Failed with ${errors} errors.`);
    process.exit(1);
}
