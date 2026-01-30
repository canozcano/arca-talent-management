import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = 'dev-secret-key-change-in-prod';
const SESSION_VALUE = 'admin-session-active';

function sign(value: string) {
    const hmac = createHmac('sha256', SECRET);
    hmac.update(value);
    return `${value}.${hmac.digest('hex')}`;
}

function verify(cookieValue: string) {
    const [value, signature] = cookieValue.split('.');
    if (!value || !signature) return false;

    const expected = sign(value).split('.')[1];
    const signatureBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);

    if (signatureBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(signatureBuf, expectedBuf) && value === SESSION_VALUE;
}

export async function createAdminSession() {
    const signed = sign(SESSION_VALUE);
    const cookieStore = await cookies();
    cookieStore.set('admin_session', signed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
    });
}

export async function verifyAdminSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('admin_session');
    if (!cookie?.value) return false;
    return verify(cookie.value);
}
