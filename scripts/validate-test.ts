
import fs from 'fs';
import path from 'path';
import { computeScores, Item } from '../lib/scoring-engine';

const itemsPath = path.join(process.cwd(), 'data', 'items.tr.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8')) as Item[];

const answersInput = `
1 = 2
2 = 3
3 = 2
4 = 3
5 = 5
6 = 4
7 = 2
8 = 5
9 = 4
10 = 2
11 = 4
12 = 4
13 = 3
14 = 3
15 = 4
16 = 1
17 = 3
18 = 4
19 = 4
20 = 5
21 = 2
22 = 4
23 = 4
24 = 2
25 = 4
26 = 1
27 = 2
28 = 5
29 = 4
30 = 5
31 = 2
32 = 4
33 = 2
34 = 4
35 = 5
36 = 4
37 = 1
38 = 3
39 = 5
40 = 4
41 = 1
42 = 4
43 = 4
44 = 4
45 = 5
46 = 2
47 = 3
48 = 3
49 = 5
50 = 4
51 = 1
52 = 4
53 = 5
54 = 1
55 = 4
56 = 1
57 = 3
58 = 2
59 = 4
60 = 5
61 = 1
62 = 5
63 = 2
64 = 4
65 = 4
66 = 4
67 = 2
68 = 3
69 = 3
70 = 4
71 = 3
72 = 4
73 = 3
74 = 3
75 = 5
76 = 4
77 = 3
78 = 4
79 = 5
80 = 4
81 = 1
82 = 2
83 = 4
84 = 1
85 = 4
86 = 1
87 = 4
88 = 5
89 = 4
90 = 5
91 = 2
92 = 2
93 = 3
94 = 3
95 = 5
96 = 3
97 = 5
98 = 2
99 = 5
100 = 4
101 = 1
102 = 4
103 = 3
104 = 4
105 = 4
106 = 2
107 = 2
108 = 4
109 = 5
110 = 5
111 = 2
112 = 1
113 = 5
114 = 3
115 = 4
116 = 1
117 = 4
118 = 3
119 = 2
120 = 5
`;

const answers: Record<string, number> = {};

answersInput.split('\n').map(line => line.trim()).filter(line => line).forEach(line => {
    const [keyPart, valPart] = line.split('=');
    if (keyPart && valPart) {
        const itemNum = keyPart.trim();
        // Since input doesn't have "item_", we construct it. 
        // Be careful! items.tr.json has "id": "item_1".
        // Let's ensure we map 1 -> item_1
        const val = parseInt(valPart.split('→')[0].trim(), 10);
        answers[`item_${itemNum}`] = val;
    }
});

const scores = computeScores(answers, items);

// Calculate Simple Sums (PDF Reference Logic seems to be this)
const simpleSums: Record<string, number> = { N: 0, E: 0, O: 0, A: 0, C: 0 };
items.forEach(item => {
    const val = answers[item.id];
    if (typeof val === 'number') {
        simpleSums[item.domain] += val;
    }
});

console.log("--- PSYCHOMETRIC RESULT (Correct Logic) ---");
Object.entries(scores.domains).forEach(([k, v]) => {
    console.log(`${k}: ${v.raw} (${v.band})`);
});
console.log(`SDR: ${scores.sdr.raw} (${scores.sdr.band})`);

console.log("\n--- PDF REFERENCE LOGIC (Simple Sum / No Reverse) ---");
Object.entries(simpleSums).forEach(([k, v]) => {
    console.log(`${k}: ${v}`);
});
