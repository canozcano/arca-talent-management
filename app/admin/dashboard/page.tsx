'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Submission = {
    id: number;
    full_name: string;
    email: string;
    test_date: string;
    is_valid: boolean;
};

export default function AdminDashboard() {
    const [reports, setReports] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/reports')
            .then(res => res.json())
            .then(data => {
                if (data.data) setReports(data.data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    // Filter Logic
    const [search, setSearch] = useState('');
    const filtered = reports.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">AR</div>
                    <span className="font-bold text-slate-900 uppercase tracking-tight">ARCA Yönetim Paneli</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase">
                    Admin
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Başvurular</h1>
                        <p className="text-slate-500 font-medium text-sm">Toplam {reports.length} başvuru görüntülendi.</p>
                    </div>
                    <div className="w-64">
                        <input
                            type="text"
                            placeholder="İsim Ara..."
                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:ring-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-bold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Aday</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Durum (SDR)</th>
                                <th className="px-6 py-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(report => (
                                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{report.full_name}</div>
                                        <div className="text-xs text-slate-400">{report.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                                        {new Date(report.test_date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${report.is_valid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {report.is_valid ? 'Geçerli' : 'Dikkat'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link
                                            href={`/admin/report/${report.id}`}
                                            className="inline-block bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                                        >
                                            Gör
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
                                                try {
                                                    const res = await fetch(`/api/admin/reports/${report.id}`, { method: 'DELETE' });
                                                    if (res.ok) {
                                                        setReports(r => r.filter(x => x.id !== report.id));
                                                    }
                                                } catch (e) { alert('Hata oluştu'); }
                                            }}
                                            className="inline-block bg-white border border-red-200 text-red-500 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
