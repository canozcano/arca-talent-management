import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    // Basic Auth Check
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const query = `
            SELECT * FROM test_submissions WHERE id = $1
        `;
        const res = await pool.query(query, [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        const submission = res.rows[0];
        return NextResponse.json({ data: submission });

    } catch (error) {
        console.error('Fetch Report Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const query = 'DELETE FROM test_submissions WHERE id = $1';
        await pool.query(query, [id]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
