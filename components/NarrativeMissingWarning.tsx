type Props = {
    missingKeys: string[];
};

export default function NarrativeMissingWarning({ missingKeys }: Props) {
    if (missingKeys.length === 0) return null;

    return (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
            <h3 className="text-sm font-bold text-amber-900 mb-2">
                Eksik anlatım metinleri (neo.docx)
            </h3>
            <p className="text-sm text-amber-800 mb-3">
                Aşağıdaki anahtarlar için <code className="bg-amber-100 px-1.5 py-0.5 rounded-lg text-xs font-mono">narratives.tr.json</code> içinde metin yok. Raporlarda placeholder görünmesin diye neo.docx’ten Türkçe metinleri ekleyin.
            </p>
            <ul className="text-xs font-mono text-amber-900 list-disc list-inside space-y-0.5 max-h-40 overflow-y-auto">
                {missingKeys.map((key) => (
                    <li key={key}>{key}</li>
                ))}
            </ul>
        </div>
    );
}
