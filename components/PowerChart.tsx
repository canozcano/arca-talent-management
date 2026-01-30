import { Scores } from "@/lib/scoring-engine";
import { DOMAIN_NAMES } from "@/lib/constants";

type Props = {
    scores: Scores;
};

export default function PowerChart({ scores }: Props) {
    const domains = ['N', 'E', 'O', 'A', 'C'] as const;

    const factorPoints = domains.map(d => {
        const raw = scores.domains[d].raw;
        const percent = ((raw - 24) / (120 - 24)) * 100;
        return { label: d, val: percent, raw };
    });

    return (
        <div className="space-y-10">
            <div className="bg-slate-50/50 rounded-xl border border-slate-200/80 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Alan Profili (Big Five)</h3>
                <div className="h-64 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="500" y2="0" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="0" y1="200" x2="500" y2="200" stroke="#e2e8f0" strokeWidth="1" />
                        <polyline
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={factorPoints.map((p, i) => {
                                const x = (i / (domains.length - 1)) * 500;
                                const y = 200 - (p.val / 100 * 200);
                                return `${x},${y}`;
                            }).join(' ')}
                        />
                        {factorPoints.map((p, i) => {
                            const x = (i / (domains.length - 1)) * 500;
                            const y = 200 - (p.val / 100 * 200);
                            return (
                                <g key={i}>
                                    <circle cx={x} cy={y} r="8" fill="#4f46e5" stroke="white" strokeWidth="2" />
                                    <text x={x} y={y - 18} textAnchor="middle" fontSize="12" fill="#334155" fontWeight="bold">{p.raw}</text>
                                    <text x={x} y={222} textAnchor="middle" fontSize="14" fill="#475569" fontWeight="bold">{p.label}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            <div className="bg-slate-50/50 rounded-xl border border-slate-200/80 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Alt Boyut Profilleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {domains.map(d => (
                        <div key={d} className="bg-white rounded-xl border border-slate-200/80 p-5">
                            <h4 className="font-bold text-sm text-slate-600 mb-4">{DOMAIN_NAMES[d]}</h4>
                            <div className="h-32 w-full">
                                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                    {[1, 2, 3, 4, 5, 6].map((f, i, arr) => {
                                        const facetKey = `${d}${f}`;
                                        const raw = scores.facets[facetKey].raw;
                                        const percent = (raw - 4) / 16;
                                        const x = (i / (arr.length - 1)) * 300;
                                        const y = 100 - (percent * 100);
                                        let nextLine = null;
                                        if (i < arr.length - 1) {
                                            const nextRaw = scores.facets[`${d}${f + 1}`].raw;
                                            const nextPct = (nextRaw - 4) / 16;
                                            const nextX = ((i + 1) / (arr.length - 1)) * 300;
                                            const nextY = 100 - (nextPct * 100);
                                            nextLine = <line x1={x} y1={y} x2={nextX} y2={nextY} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />;
                                        }
                                        return (
                                            <g key={f}>
                                                {nextLine}
                                                <circle cx={x} cy={y} r="5" fill="#64748b" stroke="white" strokeWidth="1" />
                                                <text x={x} y={y < 20 ? y + 16 : y - 8} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="600">{raw}</text>
                                            </g>
                                        );
                                    })}
                                </svg>
                                <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
