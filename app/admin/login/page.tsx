'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (data.success) {
                router.push(data.redirect || '/admin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }

        } catch (err) {
            setError('System error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="ARCA" className="h-12 mx-auto mb-4 object-contain" />
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">ARCA Personel Yönetimi</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Yönetici Girişi</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-0 text-sm font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-0 text-sm font-semibold"
                        />
                    </div>

                    {error && <div className="text-sm text-red-500 font-bold bg-red-50 p-2 rounded text-center">{error}</div>}

                    <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-colors uppercase text-xs tracking-wider">
                        Güvenli Giriş
                    </button>

                    <div className="text-center mt-4 text-[10px] text-slate-300 font-bold uppercase">
                        Gizli Erişim / Restricted Access
                    </div>
                </form>
            </div>
        </div>
    );
}
