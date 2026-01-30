# ARCA IPIP-NEO-120 — Implementation Plan & Specs

**Client:** ARCA Savunma Sanayi Tic. A.Ş.  
**Scope:** Brand-new web app; no reuse of open-source UI. Canonical item metadata from `@alheimsins/b5-johnson-120-ipip-neo-pi-r` only.

---

## 1. Implementation Plan (Ordered Tasks)

Execute in order. Dependencies are implied by step order.

| Step | Task | Notes |
|------|------|--------|
| **1** | Project bootstrap | Next.js App Router, TypeScript, Tailwind, pg (PostgreSQL). No NCU/open-source branding. |
| **2** | DB + migrations | Create DB, add migration for `submissions` and `submission_sdr` (or single table). Seed nothing. |
| **3** | Item loader | Install `@alheimsins/b5-johnson-120-ipip-neo-pi-r`. Build loader: merge by `num` (1..120) with local Turkish JSON. Export ordered array; no manual 120 items in code. |
| **4** | Turkish questions JSON | Add `data/questions.tr.json` (format §3). Placeholder 120 entries if real TR file missing; document paste/import. |
| **5** | Scoring engine | Pure functions: factor/facet bands per spec (§4). Reverse-key once: `scored = keyed === 'minus' ? 6 - stored : stored`. No SDR in factor/facet. Add unit tests (reverse, bands, ranges). |
| **6** | SDR module | 8 items, 1..5 each, range 8..40, bands 8–14 / 15–34 / 35–40. Admin-only; separate from 120. |
| **7** | User flow: identity + instruction | Page: identity fields (AD SOYAD, TARİH, DOĞUM TARİHİ, MESLEK/BİRİM, TC). Turkish instruction paragraph (exact text from spec). Age band placeholder field (optional, no logic). |
| **8** | User flow: 120-question grid | Paper-form table: No \| Statement \| 5 choice columns (Turkish labels only; no 1–5). Selectable boxes with “X” when selected. One per row. Desktop: sticky header + sticky No column. Mobile: stacked cards, same 5-box UX. Aria radio group, keyboard nav, focus state. |
| **9** | User flow: submit & confirmation | POST /api/submissions. Store answers by item id/num. Compute scores server-side. Redirect to “Submitted” page (no results). Progress “0/120” only; submit disabled until 120. |
| **10** | Admin gate | Single access-code screen (env var). No username/password. Session/cookie for admin. |
| **11** | Admin: submissions list | GET /api/admin/submissions. List with search/filter. English labels. |
| **12** | Admin: submission detail + report | GET /api/admin/submissions/:id. Full report: Factor Summary → Facet Details → Charts → SDR → AB5C. Footer on every report view: “ARCA Savunma Sanayi Tic. A.Ş. .” |
| **13** | Report: Factor Summary page | 5 factors: raw score, band (Low/Average/High), short band-based interpretation. Bilingual headings “English (Turkish)”. |
| **14** | Report: Facet Details page | All facets by factor; raw + band + short interpretation. Same heading style. |
| **15** | Report: Charts page | Line-style charts for factors; separate chart(s) for facets. Both factor and facet trends. |
| **16** | Report: SDR page | SDR score, band, explanation. Separate from personality. |
| **17** | Report: AB5C Kişilik Örüntü Tipleri | Logic: patterns eligible when ≥2 factors extreme (Low or High by band). Rank by distance from midpoint 72. Show up to 4 patterns + Turkish explanations. “How patterns are computed” section above. Source: neo.docx content. |
| **18** | Admin: fill SDR | POST /api/admin/submissions/:id/sdr. Store 8 SDR answers; recompute SDR score/band only. |
| **19** | Interpretation from neo.docx | Map bands to text blocks from neo.docx (or imported JSON). No invented content. Placeholders if doc not yet provided. |
| **20** | API security & hardening | Validate all inputs; rate-limit POST /api/submissions; CSRF for forms; admin code from env. |
| **21** | Definition of Done pass | Run DoD checklist (§7). Remove any “0/128”, debug panels, numeric 1–5 in user UI, open-source attribution. |

---

## 2. Folder / File Structure

```
arca-web/
├── app/
│   ├── layout.tsx                    # Root layout; ARCA branding only
│   ├── page.tsx                      # Landing → link to test
│   ├── globals.css
│   ├── test/
│   │   └── page.tsx                  # User test (identity + instruction + 120 grid)
│   ├── submitted/
│   │   └── [id]/
│   │       └── page.tsx              # “Submitted” confirmation (no results)
│   ├── admin/
│   │   └── page.tsx                  # Admin gate (access code)
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Submissions list (English labels)
│   │   └── submissions/
│   │       └── [id]/
│   │           └── page.tsx          # Detail + full report (multi-page)
│   ├── api/
│   │   ├── submissions/
│   │   │   └── route.ts              # POST create submission
│   │   └── admin/
│   │       ├── submissions/
│   │       │   └── route.ts          # GET list
│   │       └── submissions/
│   │           └── [id]/
│   │               ├── route.ts      # GET one
│   │               └── sdr/
│   │                   └── route.ts  # POST SDR answers
│   └── ...
├── components/
│   ├── TestIdentityForm.tsx          # Identity fields + instruction
│   ├── QuestionGrid.tsx              # 120 rows, 5 choice columns (desktop grid / mobile cards)
│   ├── ReportFactorSummary.tsx       # Factor summary page
│   ├── ReportFacetDetails.tsx        # Facet details page
│   ├── ReportCharts.tsx              # Factor + facet charts
│   ├── ReportSDR.tsx                 # SDR section
│   ├── ReportAB5CPatterns.tsx        # Kişilik Örüntü Tipleri
│   └── ReportFooter.tsx              # “ARCA Savunma Sanayi Tic. A.Ş. .”
├── lib/
│   ├── items.ts                      # Loader: npm pkg + data/questions.tr.json by num
│   ├── scoring.ts                    # Factor/facet bands, reverse-key once
│   ├── sdr.ts                        # SDR bands, 8 items
│   ├── ab5c-patterns.ts              # Extreme factors, rank by distance from 72, top 4
│   ├── db.ts                         # PostgreSQL client (pg)
│   └── auth-admin.ts                 # Admin access code check
├── data/
│   └── questions.tr.json             # num (1..120) → Turkish text (§3)
├── migrations/
│   └── 001_initial.sql               # submissions (+ SDR) schema
├── docs/
│   └── ARCA-IPIP-NEO-120-IMPLEMENTATION-PLAN.md  # This file
└── package.json
```

- **No** `lib/` or `app/` files that reference “NCU”, “open-source”, or 128 items.
- **No** red-note or private content in UI or copy.

---

## 3. Turkish Questions JSON Format

Single source for Turkish question text: **`data/questions.tr.json`**.

**Format A (object by num):**

```json
{
  "1": "Her şeye endişelenirim.",
  "2": "Kolay arkadaş edinirim.",
  ...
  "120": "Düşünmeden hareket ederim."
}
```

**Format B (array, one entry per num):**

```json
[
  { "num": 1, "text": "Her şeye endişelenirim." },
  { "num": 2, "text": "Kolay arkadaş edinirim." },
  ...
  { "num": 120, "text": "Düşünmeden hareket ederim." }
]
```

**Recommended:** Format A for simple lookup by `num` in the loader. Keys must be string digits `"1"` … `"120"`.

**Loader contract:**

- Read canonical items from `@alheimsins/b5-johnson-120-ipip-neo-pi-r` (id, num, domain, facet, keyed).
- Read `data/questions.tr.json`. If key `num` exists, use `questions[num].text` (or `.text` in array format); else use placeholder `"(TR metin henüz eklenmedi – soru " + num + ")"`.
- Output: array of 120 items in order `num` 1..120, each `{ id, num, domain, facet, keyed, textTR }`. No manual typing of 120 questions in code.

**Import process (document in README):**  
“To add or replace Turkish questions: edit `data/questions.tr.json` so each key 1..120 has the Turkish statement. No code change required.”

---

## 4. Scoring Spec & Test Cases

### 4.1 Rules

- **Stored answer:** User selection only; stored as ordinal 1..5 (no 1–5 shown in UI).
- **Scored value (per item):**  
  `scoredValue = keyed === 'minus' ? (6 - storedAnswer) : storedAnswer`
- **Reverse applied exactly once** (in scoring only; UI never shows reversal).

### 4.2 Factor Scores

- 24 items per factor (N, E, O, A, C). **Raw range: 24..120.**
- **Descriptors from community percentile** (NovoPsych / Johnson 2020): High = top 30% (≥70th), Average = middle 40% (30–70), Low = bottom 30% (≤30). Percentiles by gender/age when norm tables available.

### 4.3 Facet Scores

- 6 facets per factor, 4 items each. **Raw range: 4..20.**
- **Descriptors from community percentile:** same as factors (High ≥70, Average 30–70, Low ≤30).

- **Invariant:** No facet raw &lt; 4 (validation in tests).

### 4.4 SDR (Socially Desirable Responding)

- Items 39, 41, 45, 51, 75, 81, 101, 109 (from main 120). **Raw range: 8..40.**
- **Descriptors from percentile:** High = 90th+ (“Review Response Validity”), Average = 10–90 (“Valid Response Profile”), Low = ≤10 (“Very Candid/Self-Critical”).
- SDR does **not** affect factor/facet scores.

### 4.5 Automated Test Cases (Must Pass)

1. **Reverse-key single application**  
   For a `keyed: 'minus'` item, stored 1 → scored 5; stored 5 → scored 1. For `keyed: 'plus'`, stored 1 → scored 1; stored 5 → scored 5.

2. **No double-reverse**  
   Run scoring twice on same answers; factor and facet raw scores must be identical (no second reversal).

3. **Factor/Facet percentile band boundaries**  
   Percentile ≤30 → Low; 30–70 → Average; ≥70 → High. Neutral raw (e.g. 72 domain, 12 facet) → percentile ~50 → Average.

4. **SDR percentile band boundaries**  
   Percentile ≤10 → Low; 10–90 → Average; ≥90 → High.

5. **Facet range**  
   For any valid 120 answers, every facet raw score is in [4, 20].

6. **SDR independence**  
   SDR is computed from items 39, 41, 45, 51, 75, 81, 101, 109; changing only those answers must not change any factor or facet raw score.

---

## 5. Report Spec (Admin View)

Each report “page” is a section or tab within the admin submission detail view. Footer on every view: **“ARCA Savunma Sanayi Tic. A.Ş. .”**

| Page / Section | Content | Data / Components |
|----------------|--------|-------------------|
| **1) Factor Summary** | 5 factors: raw score, band (Low/Average/High), short band-based interpretation. Headings bilingual (e.g. “Neuroticism (Nevrotiklik)”). | `scores.domains`, band labels, interpretation text from neo.docx (or placeholder). |
| **2) Facet Details** | All facets grouped by factor; each: raw, band, short interpretation. Same heading style. | `scores.facets`, band labels, interpretation by band. |
| **3) Charts** | Line-style charts: one for 5 factors; one (or more) for facets (e.g. per factor). Show factor and facet trends. | Same `scores.domains`, `scores.facets`. |
| **4) SDR** | SDR raw score, band, explanation. Clearly separate from personality. | `scores.sdr` (or submission.sdr). |
| **5) AB5C Kişilik Örüntü Tipleri** | “How patterns are computed” (from neo.docx). Patterns eligible when ≥2 factors extreme (Low/High). Rank by distance from midpoint 72. Show up to 4 patterns with Turkish explanations. | Factor bands; extreme list; distance-from-72; pattern definitions + TR text from neo.docx. |

- **Data source for text:** neo.docx (or JSON/import derived from it). No invented psychology content.
- **Definition of Done:** No red notes or private content in any report text.

---

## 6. Migration & Data Model

### 6.1 Tables

**`submissions`**

| Column | Type | Notes |
|--------|------|--------|
| id | UUID (PK) | Default gen_random_uuid() |
| created_at | timestamptz | Default now() |
| full_name | text | AD SOYAD |
| form_date | date | TARİH |
| birth_date | date | DOĞUM TARİHİ |
| department | text | MESLEK/BİRİM |
| tc | text | TC |
| age_band | text | Optional placeholder; no logic yet |
| answers | jsonb | Map: item id or num (1..120) → 1..5 |
| factor_scores | jsonb | N,E,O,A,C raw (and optionally band) |
| facet_scores | jsonb | N1..C6 raw (and optionally band) |
| sdr_answers | jsonb | Nullable; 8 items, keys e.g. sdr_1..sdr_8, values 1..5 |
| sdr_raw | int | Nullable; 8..40 |
| sdr_band | text | Nullable; Low | Average | High |

- **Alternative:** Normalize into `submission_answers` (submission_id, item_id, value), `submission_sdr` (submission_id, item_index, value), and keep factor/facet/sdr aggregates in `submissions` or a `submission_scores` table. Above single-table design is acceptable for v1.

### 6.2 Migration (PostgreSQL)

- Create `submissions` with columns above.
- Index: `created_at DESC` for list ordering.
- No seed data required.

### 6.3 API ↔ DB

- **POST /api/submissions:** Insert row; compute factor/facet (and optionally bands); store in `factor_scores` / `facet_scores`; return id for redirect.
- **GET /api/admin/submissions:** List with optional search/filter (e.g. full_name, tc, date range).
- **GET /api/admin/submissions/:id:** One row + computed; for report use factor_scores, facet_scores, sdr_*.
- **POST /api/admin/submissions/:id/sdr:** Update `sdr_answers`, recompute `sdr_raw` and `sdr_band` only; leave factor/facet unchanged.

---

## 7. Definition of Done Checklist

- [ ] Branding: only “ARCA Savunma Sanayi Tic. A.Ş.”; no NCU or open-source attribution in UI.
- [ ] Footer on every report view: “ARCA Savunma Sanayi Tic. A.Ş. .”
- [ ] User test: Turkish questions and instruction; exactly 120 items; no SDR in user flow.
- [ ] Progress shows “0/120” (never 0/128); submit disabled until all 120 answered.
- [ ] User UI: no numeric 1–5 displayed; choice columns only Turkish labels; selection by box with “X”.
- [ ] Paper-form grid: sticky header + sticky No on desktop; stacked cards on mobile with same 5-box UX.
- [ ] Reverse-key: applied once in scoring; no double-reverse (tests pass).
- [ ] Factor/Facet bands from community percentile (NovoPsych/Johnson 2020): High ≥70th, Average 30–70, Low ≤30. SDR: High ≥90th (Review Response Validity), Average 10–90 (Valid Response Profile), Low ≤10 (Very Candid/Self-Critical). Raw scores + percentiles in report.
- [ ] SDR: items 39, 41, 45, 51, 75, 81, 101, 109 from main 120; separate report section; does not change factor/facet scores.
- [ ] Admin: English labels; single access-code gate (env-configured).
- [ ] Report: Factor Summary, Facet Details, Charts, SDR, AB5C sections; bilingual headings “English (Turkish)”; interpretations from neo.docx (or placeholders).
- [ ] AB5C: eligibility when ≥2 factors extreme; rank by distance from 72; up to 4 patterns + “how computed” + Turkish explanations.
- [ ] Questions: loaded from npm metadata + `data/questions.tr.json` by num; no manual 120 in code.
- [ ] API: POST submission, GET list, GET one, POST SDR; validation, rate-limit, CSRF, admin auth.
- [ ] No calculation/debug panels visible to user.
- [ ] No personal “red note” or private content in app or copy.

---

*End of Implementation Plan & Specs. Implement in order Step 1..21; use this document as the single source of truth for bands, UX, and DoD.*
