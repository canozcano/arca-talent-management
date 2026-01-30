# PDF (NovoPsych) ile Bizim Sistem Karşılaştırması

Bu dokümanda, IPIP-NEO-120 teknik inceleme PDF'indeki (NovoPsych, 2026) skorlama ve raporlama yöntemi ile ARCA web uygulamasındaki yöntem karşılaştırılmaktadır. **Neden aynı ham puanlarla farklı sonuçlar (Düşük/Orta/Yüksek ve örüntü tipleri) çıkabileceği** açıklanır.

---

## Faz 1 (şu an) vs Faz 2 (sonra)

- **Faz 1:** Rapor **Score (ham puan)** bazlıdır. Faktör için **Score (24–120)**, alt boyut için **Score (4–20)** gösterilir; **Descriptor** (Low / Average / High) ham puana göre sabit aralıklardan (tertile) türetilir. Topluluk yüzdelik, yaş, cinsiyet **kullanılmaz**.
- **Faz 2:** Topluluk normu, yaş ve cinsiyet eklenecek; istenirse **Community Percentile** sütunu ve yüzdelik tabanlı Descriptor eklenecek.

---

## 1. Temel Fark: Yüzdelik (Norm) vs Ham Puan Aralığı

| | **PDF / NovoPsych** | **Bizim sistem (ARCA)** |
|--|---------------------|--------------------------|
| **Veri kaynağı** | Avustralya normları (cinsiyet + yaş); Johnson (2020) verisi, ~14.000 kişi | Norm yok; sadece kişi bazlı ham puan |
| **Düzey (band) nasıl belirlenir?** | **Yüzdelik dilime** göre | **Ham puan aralığına** (sabit sınırlar) göre |
| **High** | Yüzdelik ≥ 70 (üst %30) | Faktör: ham 89–120; Alt boyut: ham 16–20 |
| **Average** | Yüzdelik 30–70 (orta %40) | Faktör: ham 57–88; Alt boyut: ham 10–15 |
| **Low** | Yüzdelik ≤ 30 (alt %30) | Faktör: ham 24–56; Alt boyut: ham 4–9 |

PDF'de "developer test" diye ayrı bir örnek yok; rapor yapısı ve **yüzdelik tabanlı** tanımlar anlatılıyor. Aynı ham puan, norm grubuna göre farklı yüzdelik (ve dolayısıyla farklı High/Average/Low) verebilir.

---

## 2. Sonuçlar Neden Farklı Çıkıyor?

### 2.1 Aynı ham puan, farklı band

- **Örnek:** Açıklık ham puanı = 67.
  - **Bizim sistem:** 57–88 aralığında → **Orta (Average)**.
  - **PDF:** Bu ham puan, örneğin 25 yaş erkek normunda 75. yüzdelikte olabilir → **Yüksek (High)**. Başka bir yaş/cinsiyet grubunda 45. yüzdelikte olabilir → **Orta**.
- Yani **tek başına ham puan 67** için "Orta" veya "Yüksek" demek, PDF'de **norm grubuna** bağlı; bizde **her zaman Orta**.

### 2.2 Görsel profil (continuum)

- **PDF:** Grafikte nokta **yüzdelik** değere göre konur (0–100 arası; topluluk içindeki konum).
- **Bizim sistem:** Nokta **ham puan**a göre konur (24–120 aralığında; kişi bazlı, topluluk karşılaştırması yok).
- Aynı kişide ham puan aynı olsa bile, PDF'deki çizgi ile bizim çizgi **farklı yerde** olur; çünkü biri yüzdelik, biri ham puan.

### 2.3 Kişilik örüntü tipleri (AB5C çaprazlama)

- **PDF:** Örüntü atanması için:
  - **High = Yüzdelik ≥ 70**
  - **Low = Yüzdelik ≤ 30**
  - En fazla 4 örüntü, **50. yüzdelikten sapma (uçluk)** sırasına göre.
- **Bizim sistem:** Örüntü atanması için:
  - **High = Ham puan 89–120 (faktör)**
  - **Low = Ham puan 24–56 (faktör)**
  - Orta (57–88) olan faktörler örüntüye **dahil edilmez**.
- **Sonuç:** Tüm faktörler sizin sistemde 57–88 aralığındaysa (hepsi Orta) **hiç örüntü çıkmaz**. PDF'de ise aynı kişinin yüzdelikleri bazı faktörlerde ≤30 veya ≥70 olabilir → **örüntü tipleri listelenir**. Bu yüzden "PDF'de örüntü var, bizde yok" veya tam tersi görülebilir.

### 2.4 Alt boyut (facet) düzeyleri

- **PDF:** Her alt boyut için yine **yüzdelik** (cinsiyet + yaş normuna göre) → High/Average/Low.
- **Bizim sistem:** Sabit ham puan aralıkları (4–9 Low, 10–15 Average, 16–20 High).
- Aynı facet ham puanı (örn. 12) bizde **Orta**; PDF'de norm grubuna göre 25. yüzdelikte **Düşük** veya 55. yüzdelikte **Orta** olabilir.

---

## 3. Özet Tablo

| Konu | PDF (NovoPsych) | Bizim sistem | Farkın nedeni |
|------|------------------|--------------|---------------|
| Faktör düzeyi (O,C,E,A,N) | Yüzdelik 30/70 kesen | Ham 56/88 (faktör) kesen | Norm vs sabit aralık |
| Alt boyut düzeyi | Yüzdelik 30/70 kesen | Ham 9/16 (facet) kesen | Aynı mantık |
| Görsel profil | Yüzdelik 0–100 eksen | Ham 24–120 eksen | Eksen tanımı farklı |
| Örüntü tipleri | Yüzdelik ≥70 / ≤30 | Ham 89+ / 56- | Uç tanımı farklı |
| SDR | Yüzdelik 10/90 | Ham 18/30 (8–40 aralığı) | Norm vs sabit aralık |

---

## 4. Ne Yapılabilir?

- **Şu anki tercih (kişi bazlı, yüzdelik yok):** Raporlar **sadece ham puan ve sabit aralıklara** göre veriliyor. PDF ile bire bir aynı çıktı beklenmemeli; **neden farklı olduğu** yukarıdaki gibidir.
- **PDF ile bire bir uyum istenirse:** Cinsiyet ve yaş bilgisi + Johnson/NovoPsych norm tabloları (veya benzeri) kullanılarak **yüzdelik hesaplanmalı**; High/Average/Low ve örüntü ataması **yüzdelik** kesenlerine (30/70 vb.) göre yapılmalı. Bu, ek norm verisi ve geliştirme gerektirir.

Bu doküman, "developer test" ile "benim testim" karşılaştırmasında görülen farkların **teknik sebebini** özetler.

---

## 5. Referans ilkesi: PDF = tek kaynak, tam eşleşme gerekir

**Referansımız PDF'dir.** Bu yüzden mantıken:

- Kullandığımız cevaplar **yalnızca** PDF'deki tablolardan tek tek okunan 1–5 değerleridir.
- Bu cevaplarla hesaplanan faktör skorları (O, C, E, A, N) PDF'de yazılan toplamlarla **tam eşleşmelidir** (83, 105, 75, 85, 50).
- "Yaklaşık" veya "ölçek/okuma farkları yüzünden tam eşleşmeyebilir" kabul edilmez: referans PDF ise, aynı cevaplar aynı skorları vermelidir.
- Cevaplar **matematiksel olarak hedefe göre ayarlanmaz** (solver kullanılmaz). Eşleşme yoksa sebep araştırılır: okuma/ölçek hatası veya PDF içinde tutarsızlık.

**Pratikte:** `data/generic-client-answers.json` içinde **sadece PDF'den okunan** cevaplar bulunmalıdır. `scripts/run-generic-client.ts` bu dosyayla skorları hesaplar ve PDF toplamlarıyla karşılaştırır. Tam eşleşme yoksa cevaplar PDF'den yeniden doğrulanmalı veya ölçek yönü (1=VA vs 5=VA sayfaları) kontrol edilmelidir. Keyed/domain/facet: `node scripts/verify-keyed.js`.

---

## 6. PDF vs Kod – Sayısal Karşılaştırma (Generic Client)

Referans ilkesine göre: **sadece PDF'den okunan** cevaplar kullanıldığında skorlar **tam örtüşmelidir**. Aşağıdaki tablolar PDF'deki Score değerleri ile kodun ürettiği değerleri karşılaştırır; fark varsa cevap okuması veya ölçek yönü yeniden kontrol edilmelidir.

### 6.1 Faktör skorları (Score 24–120)

| Faktör | PDF (NovoPsych) | Kod (ARCA) | Fark |
|--------|------------------|------------|------|
| Openness (O) | 83 | 80 | −3 |
| Conscientiousness (C) | 105 | 96 | −9 |
| Extraversion (E) | 75 | 79 | +4 |
| Agreeableness (A) | 85 | 83 | −2 |
| Neuroticism (N) | 50 | 69 | +19 |

**Özet:** Referans = PDF olduğu için bu farklar kabul edilmez; cevaplar PDF'den tekrar okunmalı ve ölçek yönü (1=VA / 5=VA) sayfa bazında netleştirilmelidir. Farklar genelde ters ölçekli sayfalar veya birkaç maddenin yanlış okunmasından kaynaklanır.

### 6.2 Alt boyut skorları (Score 4–20)

| Faktör | Alt boyut | PDF | Kod | Fark |
|--------|-----------|-----|-----|------|
| **O** | Imagination (O1) | 9 | 14 | +5 |
| **O** | Artistic Interests (O2) | 13 | 13 | 0 |
| **O** | Emotionality (O3) | 13 | 13 | 0 |
| **O** | Adventurousness (O4) | 15 | 10 | −5 |
| **O** | Intellect (O5) | 18 | 16 | −2 |
| **O** | Liberalism (O6) | 15 | 14 | −1 |
| **C** | Self-Efficacy (C1) | 19 | 19 | 0 |
| **C** | Orderliness (C2) | 14 | 9 | −5 |
| **C** | Dutifulness (C3) | 18 | 16 | −2 |
| **C** | Achievement Striving (C4) | 18 | 19 | +1 |
| **C** | Self-Discipline (C5) | 16 | 16 | 0 |
| **C** | Cautiousness (C6) | 20 | 17 | −3 |
| **E** | Friendliness (E1) | 14 | 12 | −2 |
| **E** | Gregariousness (E2) | 10 | 12 | +2 |
| **E** | Assertiveness (E3) | 16 | 17 | +1 |
| **E** | Activity Level (E4) | 11 | 12 | +1 |
| **E** | Excitement Seeking (E5) | 11 | 15 | +4 |
| **E** | Cheerfulness (E6) | 13 | 11 | −2 |
| **A** | Trust (A1) | 14 | 13 | −1 |
| **A** | Morality (A2) | 17 | 14 | −3 |
| **A** | Altruism (A3) | 14 | 15 | +1 |
| **A** | Cooperation (A4) | 19 | 12 | −7 |
| **A** | Modesty (A5) | 7 | 14 | +7 |
| **A** | Sympathy (A6) | 14 | 15 | +1 |
| **N** | Anxiety (N1) | 7 | 10 | +3 |
| **N** | Anger (N2) | 15 | 17 | +2 |
| **N** | Depression (N3) | 9 | 13 | +4 |
| **N** | Self-Consciousness (N4) | 9 | 10 | +1 |
| **N** | Immoderation (N5) | 6 | 10 | +4 |
| **N** | Vulnerability (N6) | 4 | 9 | +5 |

**Dikkat çeken farklar:** O1 (+5 kodda yüksek), O4 (−5 kodda düşük), C2 (−5), A4 (−7 kodda düşük), A5 (+7 kodda yüksek), N alt boyutlarında çoğunlukla kod yüksek. Bu da cevap eşlemesi (özellikle reverse keyed ve ölçek yönü) ile ilgili ince ayar gerektiğini gösterir.

### 6.3 Neden bu farklar?

1. **Aynı 120 cevabın kullanılmaması** veya **1–5 değerinin PDF'deki sayfaya göre yanlış yorumlanması** (bazı sayfalarda 5=VI, 1=VA).
2. **Reverse keyed maddeler:** PDF'de ters ölçek gösterilen maddelerde "seçilen kutu" ile "saklanacak 1–5 değeri" karıştırılırsa faktör/alt boyut skorları kayar.
3. **Descriptor farkı:** PDF'de Descriptor yüzdelik dilime göre (Low ≤30, High ≥70); kodda ham puana göre (Low 4–9 / 24–56, High 16–20 / 89–120). Aynı skor olsa bile descriptor bazen farklı olabilir.

Generic Client cevapları **yalnızca PDF'den** tek tek okunmalıdır; bu setle skorlar 83, 105, 75, 85, 50 ile tam eşleşene kadar okuma ve ölçek yönü gözden geçirilmelidir.
