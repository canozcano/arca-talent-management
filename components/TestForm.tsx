'use client';

import { useState } from 'react';
// import { calculateProgress } from '@/lib/scoring-engine';
import { useRouter } from 'next/navigation';
import items from '@/data/items.tr.json';

const TOTAL_ITEMS = 120;
const ITEMS_PER_PAGE = 10;
const TOTAL_PAGES = TOTAL_ITEMS / ITEMS_PER_PAGE;

export default function TestForm() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    // Answers keyed by string ID (e.g. "item_1")
    const [answers, setAnswers] = useState<Record<string, number>>({});

    // Demographics
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const progress = Math.round((Object.keys(answers).length / TOTAL_ITEMS) * 100);

    const handleAnswer = (itemId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [itemId]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    fullName,
                    email,
                    gender,
                    age: parseInt(age) || 0
                })
            });

            if (!res.ok) throw new Error('Failed to submit');

            const data = await res.json();
            if (data.success) {
                router.push('/submitted');
            } else {
                throw new Error(data.error || 'Submission failed');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentPageItems = items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    // Helper to check if current page is complete
    const isPageComplete = currentPageItems.every(item => answers[item.id] !== undefined);

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">

            {/* Header / Branding */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Personel Değerlendirme Envanteri</h1>
                <p className="text-slate-500 font-medium">Lütfen aşağıdaki soruları kendinizi en iyi tanımlayacak şekilde cevaplayınız.</p>
            </div>

            {/* Demographics */}
            {page === 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">Kişisel Bilgiler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ad Soyad</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-0 transition-colors font-semibold"
                                placeholder="Adınız ve Soyadınız"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-0 transition-colors font-semibold"
                                placeholder="ornek@sirket.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cinsiyet</label>
                            <select
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-0 transition-colors font-semibold"
                            >
                                <option value="">Seçiniz</option>
                                <option value="Male">Erkek</option>
                                <option value="Female">Kadın</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yaş</label>
                            <input
                                type="number"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-0 transition-colors font-semibold"
                                placeholder="Yaşınız"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="mb-8 sticky top-4 z-20 bg-gray-50/90 backdrop-blur pb-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>İlerleme</span>
                    <span>%{progress}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-6">
                {currentPageItems.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-bold text-lg text-slate-800 mb-6 leading-relaxed">
                            {item.num}. {item.text_tr}
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAnswer(item.id, val)}
                                    className={`py-4 rounded-xl text-sm font-bold transition-all duration-200 ${answers[item.id] === val
                                            ? 'bg-slate-900 text-white shadow-lg scale-105'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                        }`}
                                >
                                    {val === 1 && 'Katılmıyorum'}
                                    {val === 2 && 'Biraz K.'}
                                    {val === 3 && 'Nötr'}
                                    {val === 4 && 'Biraz K.'}
                                    {val === 5 && 'Katılıyorum'}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between px-2 mt-2 text-[10px] uppercase font-bold text-slate-300">
                            <span>Hiç Katılmıyorum</span>
                            <span>Tamamen Katılıyorum</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold text-center">
                    {error}
                </div>
            )}

            {/* Navigation */}
            <div className="mt-12 flex justify-between">
                <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-8 py-3 rounded-xl font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                    Önceki
                </button>

                {page < TOTAL_PAGES - 1 ? (
                    <button
                        onClick={() => {
                            if (!fullName && page === 0) {
                                alert('Lütfen Ad Soyad giriniz.');
                                return;
                            }
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setPage(p => p + 1);
                        }}
                        disabled={!isPageComplete}
                        className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                    >
                        Sonraki
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!isPageComplete || loading}
                        className="px-12 py-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        {loading ? 'Gönderiliyor...' : 'Testi Tamamla'}
                    </button>
                )}
            </div>

        </div>
    );
}
