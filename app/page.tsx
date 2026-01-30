import TestForm from '@/components/TestForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="border-b border-slate-100 py-6 px-12 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-30">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="ARCA" className="h-12 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-lg tracking-tight uppercase leading-none">Arca Savunma</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sanayi Tic. A.Ş.</span>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">Personel Alım Süreci</div>
        </div>
      </div>

      <TestForm />

      <footer className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest border-t border-slate-100 mt-12 bg-slate-50">
        &copy; {new Date().getFullYear()} Arca Savunma Sanayi Tic. A.Ş. - Tüm Hakları Saklıdır.
      </footer>
    </main>
  );
}
