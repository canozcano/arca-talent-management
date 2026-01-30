import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { computeScores } from '@/lib/scoring-engine';
import items from '@/data/items.tr.json';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { answers, fullName, email, gender, age } = body;

        // Compute scores using the existing engine
        const scores = computeScores(answers, items as any);

        // Validation logic (can be expanded)
        // For now, assume engine handles calculation.
        // We can add SDR validation flag here if needed
        const isValid = scores.sdr ? scores.sdr.band !== 'High' : true;

        // Save to Database
        const query = `
            INSERT INTO test_submissions (full_name, email, results, is_valid)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;

        // Structure the results JSON
        const resultsData = {
            scores,
            answers,
            demographics: { gender, age }
        };

        const values = [fullName, email || null, JSON.stringify(resultsData), isValid];

        const res = await pool.query(query, values);

        return NextResponse.json({ success: true, id: res.rows[0].id });

    } catch (error) {
        console.error('Submission Error:', error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
}
