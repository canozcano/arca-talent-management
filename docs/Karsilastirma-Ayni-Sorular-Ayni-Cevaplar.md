# Aynı Sorular, Aynı Cevaplar: Kaynak Karşılaştırması

Aynı **120 soruyu** (IPIP-NEO-120) ve aynı **1–5 cevapları** kullanarak üç kaynağı karşılaştırırsınız:

1. **ARCA** — Bizim sitedeki skorlama motoru.
2. **Referans** — Resmi IPIP-NEO-120 formülüne göre bağımsız skorlayıcı (ters puanlama: 6 − cevap).
3. **bigfive-test.com** — Aynı cevapları sitede doldurup sonuç sayfasındaki O,C,E,A,N.

---

## Adımlar

### 1. Cevap seti seçin

- **generic-client:** `data/generic-client-answers.json` (PDF referans cevapları)
- **Rastgele:** `npx tsx scripts/random-answers-and-score.ts [seed]` → `data/random-answers.json`

### 2. ARCA + Referans skorlarını alın

```bash
cd arca-web
npx tsx scripts/compare-sources.ts data/generic-client-answers.json
```

veya rastgele cevaplar için:

```bash
npx tsx scripts/random-answers-and-score.ts 42
npx tsx scripts/compare-sources.ts data/random-answers.json
```

Çıktıda **ARCA** ve **Referans** sütunları dolu olur; **bigfive-test.com** sütunu `–` olur.

### 3. Aynı cevapları bigfive-test.com’da doldurun

- `compare-sources` çıktısında veya `data/random-answers.json` / `data/generic-client-answers.json` içindeki **CEVAPLAR** (120 sayı) dizisini alın.
- **bigfive-test.com/tr/test** sayfasını açın.
- **bigfive-test-com-fill-console.js** içindeki `CEVAPLAR` satırını bu diziyle değiştirip scripti konsola yapıştırın; testi doldurun.
- Sonuç sayfasındaki **O, C, E, A, N** değerlerini not alın.

### 4. bigfive skorlarını karşılaştırmaya ekleyin

**Seçenek A — JSON dosyası**

`data/bigfive-scores.json` dosyasını açıp `domainTotals` içine bigfive-test.com’dan aldığınız değerleri yazın:

```json
{
  "domainTotals": {
    "O": 85,
    "C": 76,
    "E": 77,
    "A": 73,
    "N": 78
  }
}
```

Sonra tekrar çalıştırın:

```bash
npx tsx scripts/compare-sources.ts data/generic-client-answers.json
```

**Seçenek B — Komut satırı**

```bash
npx tsx scripts/compare-sources.ts data/generic-client-answers.json --bigfive 85,76,77,73,78
```

(O, C, E, A, N sırasıyla.)

---

## Çıktı örneği

```
--- Aynı sorular, aynı cevaplar: Kaynak karşılaştırması ---

Cevap dosyası: .../generic-client-answers.json

| Faktör | ARCA (bizim) | Referans (resmi formül) | bigfive-test.com |
|--------|--------------|--------------------------|------------------|
|   O    |      83      |           83             |       85         |
|   C    |     105      |          105             |       76         |
...
| ortalama |   79.6   |         79.6           |    77.8    |
```

ARCA ile Referans **aynı formül**ü kullandığı için aynı çıkmalı; fark varsa motor veya veri kontrol edilir. bigfive-test.com farklıysa madde sırası veya keying farkı olabilir.

---

## Özet

| Kaynak | Açıklama |
|--------|----------|
| **ARCA** | Bizim sitedeki skorlama (`lib/scoring-engine.ts`). |
| **Referans** | Bağımsız script (`scripts/reference-scorer.ts`), resmi domain toplamı formülü. |
| **bigfive-test.com** | Aynı CEVAPLAR ile doldurulur; sonuç sayfasındaki O,C,E,A,N elle veya HAR ile alınır. |

Aynı sorular (IPIP-NEO-120), aynı cevaplar (1–5) → üç skor seti yan yana konur; ortalamalar da tabloda gösterilir.
