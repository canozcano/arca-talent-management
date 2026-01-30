#!/usr/bin/env node
/**
 * Verifies items.tr.json keyed/domain/facet against generate-items.js MAP (IPIP-NEO-120).
 * Run: node scripts/verify-keyed.js
 */

const fs = require('fs');
const path = require('path');

const MAP = {
    N: [
        [1, 31, 61, 91],
        [6, 36, 66, '96R'],
        [11, 41, 71, 101],
        [16, 46, '76R', '106R'],
        [21, 51, '81R', '111R'],
        [26, 56, 86, '116R']
    ],
    E: [
        [2, 32, '62R', '92R'],
        [7, 37, '67R', '97R'],
        [12, 42, 72, '102R'],
        [17, 47, 77, '107R'],
        [22, 52, 82, 112],
        [27, 57, 87, 117]
    ],
    O: [
        [3, 33, 63, 93],
        [8, 38, '68R', '98R'],
        [13, 43, '73R', '103R'],
        [18, '48R', '78R', '108R'],
        [23, '53R', '83R', '113R'],
        [28, 58, '88R', '118R']
    ],
    A: [
        [4, 34, 64, '94R'],
        ['9R', '39R', '69R', '99R'],
        [14, 44, '74R', '104R'],
        ['19R', '49R', '79R', '109R'],
        ['24R', '54R', '84R', '114R'],
        [29, 59, '89R', '119R']
    ],
    C: [
        [5, 35, 65, 95],
        [10, '40R', '70R', '100R'],
        [15, 45, '75R', '105R'],
        [20, 50, '80R', '110R'],
        [25, 55, '85R', '115R'],
        ['30R', '60R', '90R', '120R']
    ]
};

const expected = {};
['N', 'E', 'O', 'A', 'C'].forEach(domain => {
    MAP[domain].forEach((arr, facetIdx) => {
        const facet = facetIdx + 1;
        arr.forEach(entry => {
            const str = String(entry);
            const keyed = str.endsWith('R') ? 'minus' : 'plus';
            const num = parseInt(str.replace('R', ''), 10);
            expected[num] = { domain, facet, keyed };
        });
    });
});

const itemsPath = path.join(process.cwd(), 'data', 'items.tr.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

let errors = 0;
items.forEach(item => {
    const num = item.num;
    const exp = expected[num];
    if (!exp) {
        console.error(`Item ${num}: not in MAP`);
        errors++;
        return;
    }
    if (item.domain !== exp.domain) {
        console.error(`Item ${num}: domain ${item.domain} expected ${exp.domain}`);
        errors++;
    }
    if (item.facet !== exp.facet) {
        console.error(`Item ${num}: facet ${item.facet} expected ${exp.facet}`);
        errors++;
    }
    if (item.keyed !== exp.keyed) {
        console.error(`Item ${num}: keyed ${item.keyed} expected ${exp.keyed}`);
        errors++;
    }
});

if (errors === 0) {
    console.log('OK: All 120 items match MAP (domain, facet, keyed).');
} else {
    console.error(`\nTotal: ${errors} mismatch(es).`);
    process.exit(1);
}
