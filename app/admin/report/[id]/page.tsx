'use client';

import { useState, useEffect } from 'react';
import ReportTabs from '@/components/ReportTabs';
import { useParams } from 'next/navigation';

export default function AdminReportView() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        fetch(`/api/admin/reports/${params.id}`)
            .then(res => res.json())
            .then(json => {
                if (json.data) setData(json.data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Rapor Yükleniyor...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center font-bold text-red-400">Rapor Bulunamadı</div>;

    const { results } = data; // JSONB results from DB
    // results has { scores: ..., answers: ... }

    return (
        <div>
            {/* Admin Back Bar */}
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest flex justify-between items-center print:hidden">
                <a href="/admin/dashboard" className="hover:text-slate-300">← Panela Dön</a>
                <span>{data.full_name} - {new Date(data.test_date).toLocaleDateString()}</span>
                <button
                    onClick={() => window.print()}
                    className="bg-white text-slate-900 px-3 py-1 rounded-sm hover:bg-slate-100"
                >
                    PDF İndir
                </button>
            </div>

            <ReportTabs scores={results.scores} />
        </div>
    );
}
