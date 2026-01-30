export default function SubmittedPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Teşekkürler</h1>
                <p className="text-slate-600 leading-relaxed mb-8">
                    Değerlendirmeniz başarıyla alınmıştır ve güvenli bir şekilde insan kaynakları birimimize iletilmiştir.
                </p>
                <div className="p-4 bg-slate-50 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                    Gizli Belge / Confidential
                </div>
                <div className="mt-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                    ARCA SAVUNMA SANAYİ
                </div>
            </div>
        </div>
    );
}
