'use client';

import { useState, useMemo } from 'react';
import { Scores, Band } from '@/lib/scoring-engine';
import { DOMAIN_NAMES, FACET_NAMES, getSDRNarrative } from '@/lib/constants';

type Props = {
    scores: Scores;
};

// Helper: Position from raw score on scale (person-based visual profile)
// Helper: Facet chart bar width from raw score (4–20)
const getVisualPosition = (raw: number, min: number, max: number) => {
    const p = Math.round(((raw - min) / (max - min)) * 100);
    return Math.max(1, Math.min(99, p));
};

const DOMAIN_ORDER = ['O', 'C', 'E', 'A', 'N'] as const;
const FACET_COLORS: Record<string, string> = {
    O: '#8b5cf6', // Violet
    C: '#10b981', // Emerald
    E: '#3b82f6', // Blue
    A: '#f43f5e', // Rose
    N: '#f59e0b', // Amber
};

const DOMAIN_THEMES: Record<string, { bg: string, text: string, border: string, gradient: string }> = {
    O: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600' },
    C: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-400 to-teal-600' },
    E: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-400 to-cyan-600' },
    A: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', gradient: 'from-rose-400 to-pink-600' },
    N: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-400 to-orange-500' },
};

const BAND_MAP: Record<string, string> = {
    'Low': 'Düşük',
    'Average': 'Orta',
    'High': 'Yüksek'
};



export default function ReportTabs({ scores }: Props) {
    const [activeTab, setActiveTab] = useState<'page1' | 'page2' | 'page3'>('page1');

    // Kişilik örüntü tipleri: AB5C çaprazlaması (2×2, extremity sıralı)
    const patternResult = scores.patterns || [];

    // SDR Logic (Admin note)
    const sdrResult = scores.sdr;
    const sdrRaw = sdrResult?.raw ?? 0;

    // SDR Bands
    let sdrLabel = BAND_MAP[sdrResult?.band || 'Average'];

    const getBandIcon = (band: string) => {
        if (band === 'High') return '▲';
        if (band === 'Low') return '▼';
        return '●';
    };

    const getBandStyle = (band: string) => {
        if (band === 'High') return 'bg-slate-900 text-white ring-slate-900';
        if (band === 'Low') return 'bg-white text-slate-600 ring-slate-300';
        return 'bg-gray-100 text-gray-700 ring-transparent';
    };

    return (
        <div className="flex flex-col space-y-8 font-sans text-slate-800 bg-gray-50/50 p-8 min-h-screen">
            {/* Modern Tab Navigation (Segmented Control) */}
            <div className="print:hidden flex justify-center">
                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-1 relative">
                    {['page1', 'page2', 'page3'].map((page) => (
                        <button
                            key={page}
                            onClick={() => setActiveTab(page as any)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all duration-300 ${activeTab === page
                                ? 'bg-slate-900 text-white shadow-md scale-105'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {page === 'page1' ? 'Özet' : page === 'page2' ? 'Detaylar' : 'Grafikler'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Report Page Container */}
            <div className="bg-white border border-slate-200 shadow-xl rounded-sm min-h-[1123px] w-full max-w-[794px] mx-auto p-12 relative flex flex-col print:shadow-none print:border-none print:w-full print:p-0 print:m-0">

                {/* Global Header */}
                {/* Global Header */}
                <div className="mb-8 border-b-2 border-slate-900 pb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">Personel<br />Değerlendirme</h1>
                        <div className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-[0.2em]">Gelişmiş Kişilik Raporu</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Rapor Tarihi</div>
                        <div className="text-lg font-bold text-slate-900 font-mono">{new Date().toLocaleDateString('tr-TR')}</div>
                    </div>
                </div>

                {/* --- PAGE 1: Factor Summary --- */}
                {activeTab === 'page1' && (
                    <div className="space-y-8 flex-1">
                        <div>
                            <h3 className="flex items-center gap-3 font-bold text-lg mb-5 text-slate-900 uppercase tracking-widest pl-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                                Faktör Özeti
                            </h3>
                            <div className="overflow-hidden bg-white shadow-sm border border-slate-100 rounded-2xl">
                                <table className="w-full text-sm border-collapse">
                                    <thead className="bg-slate-50/80 backdrop-blur">
                                        <tr className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">
                                            <th className="py-4 px-6 text-left">Faktör</th>
                                            <th className="py-4 px-6 text-center w-32">Puan</th>
                                            <th className="py-4 px-6 text-center w-32">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {DOMAIN_ORDER.map((d) => {
                                            const s = scores.domains[d];
                                            const theme = DOMAIN_THEMES[d];
                                            return (
                                                <tr key={d} className="group hover:bg-slate-50 transition-colors duration-200">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-lg ${theme.bg} ${theme.text}`}>
                                                                {d}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 text-base">{DOMAIN_NAMES[d]}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className="font-mono font-black text-2xl text-slate-800 tracking-tight">{s.raw}</span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${getBandStyle(s.band)}`}>
                                                            <span className="text-[8px]">{getBandIcon(s.band)}</span>
                                                            {BAND_MAP[s.band]}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SDR Validity Check */}
                        <div className="mt-8">
                            <h3 className="font-bold text-lg mb-3 text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Geçerlilik Kontrolü</h3>
                            <div className="p-4 rounded-sm border border-slate-200 bg-slate-50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-slate-900">SDR Puanı: {sdrRaw}</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${getBandStyle(sdrResult?.band || 'Average')}`}>
                                        <span className="text-[8px]">{getBandIcon(sdrResult?.band || 'Average')}</span>
                                        {sdrLabel} ({sdrResult?.band})
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-300 pl-3">{getSDRNarrative((sdrResult?.band || 'Average') as any)}</p>
                            </div>
                        </div>

                        {/* Görsel Profil */}
                        <div className="mt-8">
                            <h3 className="font-bold text-center text-xs mb-6 uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2">Görsel Profil (Visual Profile)</h3>
                            <div className="relative border border-slate-200 bg-white p-6 rounded-sm">
                                {/* Zones */}
                                <div className="absolute inset-0 flex pointer-events-none opacity-50">
                                    <div className="w-[34%] bg-slate-100 border-r border-slate-200"></div>
                                    <div className="w-[33%] bg-white border-r border-slate-200"></div>
                                    <div className="w-[33%] bg-slate-50"></div>
                                </div>
                                <div className="absolute top-0 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-400 uppercase px-2 pt-1">
                                    <span>Düşük</span>
                                    <span className="pl-12">Orta</span>
                                    <span>Yüksek</span>
                                </div>

                                <div className="space-y-6 mt-6 relative z-10">
                                    {DOMAIN_ORDER.map((d) => {
                                        const s = scores.domains[d];
                                        const theme = DOMAIN_THEMES[d];
                                        const p = getVisualPosition(s.raw, 24, 120);

                                        return (
                                            <div key={d} className="relative h-12 flex items-center group">
                                                {/* Track */}
                                                <div className="absolute inset-x-0 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full opacity-20 ${theme.bg}`} style={{ width: '100%' }}></div>
                                                </div>

                                                {/* Label */}
                                                <div className="absolute left-0 -top-3 text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 bg-white px-1 shadow-sm rounded-md border border-slate-100">
                                                    {d}
                                                </div>

                                                {/* Marker */}
                                                <div
                                                    className={`absolute w-10 h-10 rounded-xl border-[4px] border-white shadow-xl font-bold text-xs flex items-center justify-center z-20 transform -translate-x-1/2 transition-all duration-1000 ${theme.bg} ${theme.text}`}
                                                    style={{ left: `${p}%` }}
                                                >
                                                    {s.raw}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-mono px-1">
                                    <span>24</span><span>56</span><span>88</span><span>120</span>
                                </div>
                            </div>
                        </div>

                        {/* Kişilik Örüntü Tipleri */}
                        <div className="mt-10">
                            <h3 className="flex items-center gap-3 font-bold text-lg mb-5 text-slate-900 uppercase tracking-widest pl-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                                Dominant Örüntüler
                            </h3>
                            {patternResult.length === 0 ? (
                                <div className="text-sm text-slate-500 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 italic text-center">
                                    Profilinizde belirgin bir uç nokta (yüksek veya düşük) saptanmamıştır. Tüm faktörler ortalama düzeydedir.
                                </div>
                            ) : (
                                <ul className="grid grid-cols-1 gap-4">
                                    {patternResult.map((p, i) => (
                                        <li key={p.key} className="relative bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group">
                                            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-slate-800 to-slate-600 rounded-l-2xl group-hover:w-2 transition-all"></div>
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-black shadow-lg shadow-slate-200 transform group-hover:scale-110 transition-transform">{i + 1}</div>
                                                <span className="font-black text-slate-900 text-lg tracking-tight">{p.name}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed pl-12 text-justify">{p.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* --- PAGE 2: Facet Details --- */}
                {activeTab === 'page2' && (
                    <div className="space-y-8 flex-1">
                        <h3 className="flex items-center gap-3 font-bold text-lg mb-4 text-slate-900 uppercase tracking-widest pl-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                            Alt Boyut Detayları
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                            {DOMAIN_ORDER.map((d) => {
                                const theme = DOMAIN_THEMES[d];
                                return (
                                    <div key={d} className="break-inside-avoid">
                                        <div className={`flex items-center gap-3 mb-3 pb-2 border-b ${theme.border}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm ${theme.bg} ${theme.text}`}>
                                                {d}
                                            </div>
                                            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">{DOMAIN_NAMES[d]}</h3>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                                            <table className="w-full text-xs">
                                                <thead className="bg-slate-50/50">
                                                    <tr>
                                                        <th className="py-2.5 px-3 text-left text-slate-400 font-bold">Alt Boyut</th>
                                                        <th className="py-2.5 px-3 text-center text-slate-400 font-bold w-14">Puan</th>
                                                        <th className="py-2.5 px-3 text-center text-slate-400 font-bold w-20">Durum</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 bg-white">
                                                    {[1, 2, 3, 4, 5, 6].map((f, i) => {
                                                        const key = `${d}${f}`;
                                                        const s = scores.facets[key];
                                                        const facetLabel = FACET_NAMES[key] ?? key;
                                                        return (
                                                            <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-3 px-3 text-slate-600 font-bold border-r border-slate-50">{facetLabel}</td>
                                                                <td className="py-3 px-3 text-center font-bold text-slate-900 border-r border-slate-50">{s.raw}</td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${s.band === 'High' ? theme.bg + ' ' + theme.text : s.band === 'Low' ? 'bg-slate-100 text-slate-500' : 'text-slate-300'}`}>
                                                                        {s.band === 'High' ? 'H' : s.band === 'Low' ? 'L' : '•'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- PAGE 3: Charts --- */}
                {activeTab === 'page3' && (
                    <div className="space-y-12 flex-1">
                        <h3 className="flex items-center gap-3 font-bold text-lg mb-4 text-slate-900 uppercase tracking-widest pl-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                            Grafiksel Analiz
                        </h3>

                        <div className="grid grid-cols-1 gap-12">
                            {DOMAIN_ORDER.map((d) => {
                                const theme = DOMAIN_THEMES[d];
                                return (
                                    <div key={d} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-100 ${theme.bg}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm bg-white ${theme.text}`}>
                                                    {d}
                                                </div>
                                                <h4 className={`font-black text-sm uppercase tracking-wider ${theme.text}`}>
                                                    {DOMAIN_NAMES[d]}
                                                </h4>
                                            </div>
                                            <div className="bg-white px-3 py-1 rounded-md shadow-sm border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Puan: {scores.domains[d].raw}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 relative">
                                            {/* Axis/Grid Background */}
                                            <div className="absolute inset-y-0 left-64 right-16 flex pointer-events-none opacity-50">
                                                {/* Low (4-9) -> 6 units (37.5%) */}
                                                <div className="w-[37.5%] h-full bg-slate-50 border-r border-slate-200 border-dashed"></div>
                                                {/* Avg (10-15) -> 6 units (37.5%) */}
                                                <div className="w-[37.5%] h-full bg-white border-r border-slate-200 border-dashed"></div>
                                                {/* High (16-20) -> 5 units (25%) */}
                                                <div className="w-[25%] h-full bg-slate-50"></div>
                                            </div>

                                            <div className="space-y-3 relative z-10">
                                                {[1, 2, 3, 4, 5, 6].map(f => {
                                                    const facetKey = `${d}${f}`;
                                                    const s = scores.facets[facetKey];
                                                    const facetLabel = FACET_NAMES[facetKey] ?? facetKey;
                                                    const visualP = getVisualPosition(s.raw, 4, 20);

                                                    return (
                                                        <div key={f} className="flex items-center h-8 relative group">
                                                            <div className="w-64 text-right pr-6 text-[11px] font-bold text-slate-500 truncate" title={facetLabel}>{facetLabel}</div>
                                                            <div className="flex-1 relative h-full flex items-center">
                                                                {/* Bar Track */}
                                                                <div className="w-full bg-slate-100/50 h-2.5 rounded-full overflow-hidden relative ring-1 ring-slate-100">
                                                                    <div
                                                                        className={`absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r ${theme.gradient} shadow-sm transition-all duration-1000`}
                                                                        style={{ width: `${visualP}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                            <div className="w-16 pl-4 text-left font-mono font-bold text-slate-700 text-xs">{s.raw}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Axis Labels */}
                                            <div className="pl-64 pr-16 mt-4 flex justify-between text-[9px] font-bold text-slate-400 font-mono">
                                                <span>4</span>
                                                <span>9</span>
                                                <span>15</span>
                                                <span>20</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ARCA Savunma Sanayi</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Gizli Belge / Confidential</span>
                </div>
            </div>
        </div>
    );
}
