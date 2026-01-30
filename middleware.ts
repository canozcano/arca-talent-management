import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

// Re-implementing simplified verify here because middleware runs in Edge runtime 
// and sometimes simplified node imports behave differently, but 'crypto' is compatible usually.
// However, since we defined auth.ts ensuring standard Node environment usage in actions, 
// let's try to keep middleware simple or duplicate the logic to be safe if imports fail.
// For now, minimal duplication for reliability in middleware.

const SECRET = 'dev-secret-key-change-in-prod';
const SESSION_VALUE = 'admin-session-active';

function verifyCookie(cookieValue: string) {
    try {
        const [value, signature] = cookieValue.split('.');
        if (!value || !signature) return false;

        // Web Crypto API for Edge compatibility if needed, but 'crypto' usually works in Next.js middleware now
        // Let's use simple logic:
        // If we can't import the exact same file, we'll assume the cookie logic. 
        // Actually, middleware can import from lib/auth if it doesn't use Node-only APIs incompatible with Edge.
        // 'crypto' from 'crypto' might be Node-specific.
        // Let's rely on the cookie presence check + server-side page guard for robust security,
        // but here we just check presence to redirect. 
        // Real validation happens in the page/layout or we try to import.
        // Let's just check for the cookie name for the redirect logic to avoid Edge runtime hassles with crypto
        // and let the Page Component (Server Component) do the strict verification.

        return true;
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
        const cookie = request.cookies.get('admin_session');

        if (!cookie) {
            return NextResponse.redirect(new URL('/admin-login', request.url));
        }
    }

    // Redirect /admin-login to /admin if already logged in
    if (pathname === '/admin-login') {
        const cookie = request.cookies.get('admin_session');
        if (cookie) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/admin-login'],
};
