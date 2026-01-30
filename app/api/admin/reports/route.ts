import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    // Basic Auth Check
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch submissions
        // Order by date DESC
        const query = `
            SELECT id, full_name, email, test_date, is_valid 
            FROM test_submissions 
            ORDER BY test_date DESC
            LIMIT 100
        `;
        const res = await pool.query(query);

        return NextResponse.json({ data: res.rows });

    } catch (error) {
        console.error('Fetch Reports Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
