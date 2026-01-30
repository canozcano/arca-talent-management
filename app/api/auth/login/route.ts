import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Simple query (In production, use bcrypt compare)
        const query = 'SELECT * FROM admins WHERE username = $1';
        const res = await pool.query(query, [username]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const admin = res.rows[0];

        // Check password (In production replace with hash check)
        if (admin.password_hash !== password) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Set cookie? Or return token?
        // For simplicity in this demo, we'll return a "token" or simple success
        // and handle session via Next.js middleware or client-side storage for this rapid prototype.
        // Ideally use httpOnly cookies.

        // Let's set a simple cookie header manually or rely on client to store "isLoggedIn"
        // But for "secure" admin panel, we really should use cookies.

        const response = NextResponse.json({ success: true, redirect: '/admin/dashboard' });

        response.cookies.set('admin_session', username, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
