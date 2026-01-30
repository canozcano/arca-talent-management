import narratives from '@/data/narratives.tr.json';

/** Placeholder when narrative is missing (source: neo.docx). */
export const MISSING_NARRATIVE_PREFIX = '[MISSING TEXT:';

export const DOMAIN_NAMES: Record<string, string> = {
    N: 'Neuroticism (Nevrotiklik)',
    E: 'Extraversion (Dışadönüklük)',
    O: 'Openness (Açıklık)',
    A: 'Agreeableness (Uyumluluk)',
    C: 'Conscientiousness (Sorumluluk)'
};

/** Facet sub-subheadings per IPIP-NEO-120 Review Paper (Johnson 2014; NovoPsych). Keys: O1..C6. */
export const FACET_NAMES: Record<string, string> = {
    O1: 'Imagination (Hayal Gücü)',
    O2: 'Artistic Interests (Sanatsal İlgi)',
    O3: 'Emotionality (Duygusallık)',
    O4: 'Adventurousness (Maceraperestlik)',
    O5: 'Intellect (Entelektüellik)',
    O6: 'Liberalism (Liberalizm)',
    C1: 'Self-Efficacy (Öz-Yeterlilik)',
    C2: 'Orderliness (Düzenlilik)',
    C3: 'Dutifulness (Görev Bilinci)',
    C4: 'Achievement Striving (Başarı Çabası)',
    C5: 'Self-Discipline (Öz-Disiplin)',
    C6: 'Cautiousness (Temkinlilik)',
    E1: 'Friendliness (Dostluk)',
    E2: 'Gregariousness (Sosyallik)',
    E3: 'Assertiveness (Atılganlık)',
    E4: 'Activity Level (Aktivite Düzeyi)',
    E5: 'Excitement Seeking (Heyecan Arayışı)',
    E6: 'Cheerfulness (Neşe)',
    A1: 'Trust (Güven)',
    A2: 'Morality (Ahlak)',
    A3: 'Altruism (Özgecilik)',
    A4: 'Cooperation (İşbirliği)',
    A5: 'Modesty (Alçakgönüllülük)',
    A6: 'Sympathy (Sempati)',
    N1: 'Anxiety (Kaygı)',
    N2: 'Anger (Öfke)',
    N3: 'Depression (Depresyon)',
    N4: 'Self-Consciousness (Öz-Bilinç)',
    N5: 'Immoderation (Aşırılık)',
    N6: 'Vulnerability (Kırılganlık)',
};

// Map standardized bands to Turkish titles (Factor/Facet)
export const BAND_TITLES: Record<string, string> = {
    High: 'Yüksek',
    Average: 'Ortalama',
    Low: 'Düşük',
};

// SDR descriptor labels (NovoPsych): percentile-based; not raw bands.
export const SDR_DESCRIPTOR_LABELS: Record<string, string> = {
    High: 'Review Response Validity',       // 90th percentile or above
    Average: 'Valid Response Profile',      // 10th–90th percentile
    Low: 'Very Candid/Self-Critical',       // 10th percentile or below
};

type Band = 'High' | 'Average' | 'Low';

function isMissing(text: string | undefined): boolean {
    if (text === undefined || text === null || String(text).trim() === '') return true;
    return String(text).startsWith(MISSING_NARRATIVE_PREFIX);
}

/** Domain narrative by band. Source: neo.docx → narratives.tr.json. Missing → "[MISSING TEXT: <key>]". */
export function getDomainNarrative(domain: string, band: Band): string {
    const key = `${domain}-${band}`;
    // @ts-expect-error narratives shape
    const text = narratives.domains?.[domain]?.[band];
    return !isMissing(text) ? String(text) : `[MISSING TEXT: ${key}]`;
}

/** Facet narrative by band. Source: neo.docx → narratives.tr.json. Missing → "[MISSING TEXT: <key>]". */
export function getFacetNarrative(facetKey: string, band: Band): string {
    const key = `${facetKey}-${band}`;
    // @ts-expect-error narratives shape
    const text = narratives.facets?.[facetKey]?.[band];
    return !isMissing(text) ? String(text) : `[MISSING TEXT: ${key}]`;
}

/** SDR narrative by band. Source: neo.docx → narratives.tr.json. Missing → "[MISSING TEXT: <key>]". */
export function getSDRNarrative(band: Band): string {
    const key = `SDR-${band}`;
    const text = narratives.sdr?.[band];
    return !isMissing(text) ? String(text) : `[MISSING TEXT: ${key}]`;
}

const DOMAINS = ['N', 'E', 'O', 'A', 'C'] as const;
const BANDS: Band[] = ['Low', 'Average', 'High'];
const FACET_KEYS = DOMAINS.flatMap(d => [1, 2, 3, 4, 5, 6].map(f => `${d}${f}`));

/** Returns narrative keys that are missing (no content from neo.docx). For admin warning. */
export function getMissingNarrativeKeys(): string[] {
    const missing: string[] = [];
    for (const d of DOMAINS) {
        for (const band of BANDS) {
            const key = `${d}-${band}`;
            if (isMissing(narratives.domains?.[d]?.[band])) missing.push(key);
        }
    }
    for (const f of FACET_KEYS) {
        for (const band of BANDS) {
            const key = `${f}-${band}`;
            // @ts-expect-error narratives shape
            if (isMissing(narratives.facets?.[f]?.[band])) missing.push(key);
        }
    }
    for (const band of BANDS) {
        const key = `SDR-${band}`;
        if (isMissing(narratives.sdr?.[band])) missing.push(key);
    }
    return missing.sort();
}
