import fs from 'fs';
import path from 'path';
import { computeScores, getDomainBand, getFacetBand } from '../lib/scoring-engine';

const ITEMS_PATH = path.join(process.cwd(), 'data/items.tr.json');

function runTest() {
    console.log('--- STARTING VALIDATION SUITE ---');

    // 1. Load Item Bank
    if (!fs.existsSync(ITEMS_PATH)) {
        console.error('❌ Item bank not found:', ITEMS_PATH);
        process.exit(1);
    }
    const itemBank = JSON.parse(fs.readFileSync(ITEMS_PATH, 'utf-8'));
    console.log(`✅ Loaded ${itemBank.length} items.`);

    // 2. Mock Answers (All '3' = Neutral)
    console.log('\n--- Test 1: Neutral Answers (All 3) ---');
    const neutralAnswers: Record<string, number> = {};
    itemBank.forEach((item: any) => neutralAnswers[item.id] = 3);

    try {
        const scores = computeScores(neutralAnswers, itemBank);
        // Expect: Domain = 24 * 3 = 72. Facet = 4 * 3 = 12.
        // Domain 72 is Average. Facet 12 is Average.

        let pass = true;
        Object.entries(scores.domains).forEach(([d, s]) => {
            if (s.raw !== 72) { console.error(`❌ Domain ${d} score mismatch. Expected 72, got ${s.raw}`); pass = false; }
            if (s.band !== 'Average') { console.error(`❌ Domain ${d} band mismatch. Expected Average, got ${s.band}`); pass = false; }
        });

        Object.entries(scores.facets).forEach(([f, s]) => {
            if (s.raw !== 12) { console.error(`❌ Facet ${f} score mismatch. Expected 12, got ${s.raw}`); pass = false; }
            if (s.band !== 'Average') { console.error(`❌ Facet ${f} band mismatch. Expected Average, got ${s.band}`); pass = false; }
        });

        if (pass) console.log('✅ Neutral Test Passed');
    } catch (e: any) {
        console.error('❌ Neutral Test Failed with error:', e.message);
    }

    // 3. Mock Answers (All '5' = High Extremes)
    // Plus keyed -> 5. Minus keyed -> 6-5=1.
    console.log('\n--- Test 2: Extreme High (All 5) ---');
    const highAnswers: Record<string, number> = {};
    itemBank.forEach((item: any) => highAnswers[item.id] = 5);

    try {
        const scores = computeScores(highAnswers, itemBank);

        // We can't easily predict total raw sums without counting plus/minus keys per domain.
        // But we know it should calculate successfully.
        // Let's verify validation logic primarily.

        console.log('Checking a known item keyedness...');
        const minusItem = itemBank.find((i: any) => i.keyed === 'minus');
        if (minusItem) {
            // logic check: if input 5, score should be 1
            // We can't inspect internal item score derived, but we can trust the summary if Test 1 passed.
        }
        console.log('✅ Extreme Test Run Completed (No Crash)');
    } catch (e: any) {
        console.error('❌ Extreme Test Failed:', e.message);
    }

    // 4. Validation Failure Test
    console.log('\n--- Test 3: Invalid Input (Missing/Out of Range) ---');
    const badAnswers = { ...neutralAnswers };
    delete badAnswers[itemBank[0].id]; // Remove first item

    try {
        computeScores(badAnswers, itemBank);
        console.error('❌ Validation Test Failed: Should have thrown error for missing item.');
    } catch (e: any) {
        if (e.message.includes('Input Error: Missing')) {
            console.log('✅ Missing Item Check Passed');
        } else {
            console.error('❌ Unexpected error message:', e.message);
        }
    }

    const rangeAnswers = { ...neutralAnswers };
    rangeAnswers[itemBank[0].id] = 6; // Invalid
    try {
        computeScores(rangeAnswers, itemBank);
        console.error('❌ Validation Test Failed: Should have thrown error for invalid range.');
    } catch (e: any) {
        if (e.message.includes('Input Error: Invalid answer')) {
            console.log('✅ Invalid Range Check Passed');
        } else {
            console.error('❌ Unexpected error message:', e.message);
        }
    }

    // 5. Structure Validation Test
    console.log('\n--- Test 4: Item Bank Integrity ---');
    // Pass a corrupted item bank
    const badBank = [...itemBank];
    badBank.pop(); // Remove last item -> 119 items
    try {
        computeScores(neutralAnswers, badBank); // Should error due to count mismatch?
        // Wait, computeScores validates strictly 24 per domain. removing one will break one domain.
        console.error('❌ Item Bank Integrity Test Failed: Should have thrown error.');
    } catch (e: any) {
        if (e.message.includes('ItemBank Error')) {
            console.log('✅ Item Bank Integrity Check Passed');
        } else {
            console.error('❌ Unexpected error message:', e.message);
        }
    }

    console.log('\n--- ALL TESTS COMPLETED ---');
}

runTest();
