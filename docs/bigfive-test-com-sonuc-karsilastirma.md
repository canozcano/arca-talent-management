# bigfive-test.com Sonuç Karşılaştırması

**Sonuç sayfası:** https://bigfive-test.com/tr/result/697ca45249702b50cc4e3e22  
**Tarih:** 30 Ocak 2026

---

## 1. bigfive-test.com’da Görünen Skorlar (senin testin)

Sayfadan çıkarılan **faktör toplamları** (6 facet × domain):

| Faktör | bigfive-test.com (ham toplam) | Facet skorları (sayfadan) |
|--------|-------------------------------|----------------------------|
| **O** (Deneyime Açıklık) | **85** | Hayal Gücü 18, Sanatsal İlgi 9, Duygusallık 14, Maceraperestlik 13, Entelekt 15, Liberalizm 16 |
| **C** (Sorumluluk) | **76** | Öz-Yeterlik 10, Düzenlilik 15, Görev Bilinci 13, Başarı Çabalamak 13, Öz Disiplin 13, İhtiyatlılık 12 |
| **E** (Dışadönüklük) | **77** | Arkadaşlık 12, Sosyallik 15, Girişkenlik 11, Aktivite 17, Heyecan Arayışı 9, Neşelilik 13 |
| **A** (Uyumluluk) | **71** | Güven 13, Ahlak 12, Diğergamlık 9, İşbirliği 13, Mütevazılık 14, Şefkat 12 |
| **N** (Nörotisizm) | **78** | Kaygı 7, Öfke 11, Depresyon 15, Öz Bilinç 15, Ölçüsüzlük 17, Güçsüzlük 13 |

---

## 2. Referans: PDF / generic-client (bizim cevap seti)

**Aynı 120 cevabı** (`data/generic-client-answers.json`) bizim motorla hesaplandığında:

| Faktör | Referans (PDF / bizim sistem) |
|--------|-------------------------------|
| O | 83 |
| C | 105 |
| E | 75 |
| A | 85 |
| N | 50 |

---

## 3. Karşılaştırma Tablosu

| Faktör | bigfive-test.com (senin sonuç) | Referans (generic-client) | Fark |
|--------|---------------------------------|----------------------------|------|
| O | 85 | 83 | +2 |
| C | 76 | 105 | **−29** |
| E | 77 | 75 | +2 |
| A | 71 | 85 | **−14** |
| N | 78 | 50 | **+28** |

---

## 4. Nasıl İşaretlemişsin? (Yorum)

- **Referansla aynı cevaplar olsaydı** (script’teki 120 cevap), bigfive-test.com’da da **O≈83, C≈105, E≈75, A≈85, N≈50** civarı beklenirdi.
- Senin bigfive-test.com sonuçların (**O=85, C=76, E=77, A=71, N=78**) referanstan belirgin şekilde farklı:
  - **C (Sorumluluk)** çok daha düşük (76 vs 105),
  - **N (Nörotisizm)** çok daha yüksek (78 vs 50),
  - **A (Uyumluluk)** daha düşük (71 vs 85).

Bu fark şu sebeplerden biri veya birkaçından kaynaklanıyor olabilir:

1. **Farklı cevaplarla doldurulmuş olması**  
   Script’teki 120 cevap yerine testi elle veya farklı cevaplarla doldurduysan skorlar değişir.

2. **Script’in takılı kalıp elle devam etmen**  
   SONRAKİ’yi elle tıklayıp bazı sayfalarda farklı seçenek işaretlemiş olabilirsin.

3. **bigfive-test.com’un madde sırası / keying farkı**  
   Site IPIP-NEO-120 kullanıyorsa bile madde sırası veya ters puanlama (keying) bizim MAP’ten farklı olabilir; aynı cevaplar bile olsa skorlar örtüşmeyebilir.

**Özet:** Şu anki bigfive-test.com sonucun, “generic-client” referans cevaplarıyla uyuşmuyor; ya cevap seti farklı ya da sitenin skorlama/madde eşlemesi farklı. Referansla bire bir karşılaştırmak için aynı 120 cevabın script ile baştan sona bigfive-test.com’da işaretlenmesi ve sitenin verdiği O,C,E,A,N’in alınması gerekir.

---

## 5. Sonuç sayfasında "neyi nasıl işaretledim?" görmek

Sonuç ekranındayken (örn. `tr/result/697ca452...`) **F12 → Console** açıp aşağıdaki script'i yapıştırıp Enter'a basın. Script, sayfada veya tarayıcı deposunda (localStorage/sessionStorage) 120 cevaplık veri arar; bulursa `item_1` … `item_120` formatında yazar.

- **Script dosyası:** `scripts/bigfive-result-page-inspect-console.js`
- Cevaplar bazen sadece sunucuda tutulur; o durumda Console'da "bulunamadı" der. O zaman **Network** sekmesinde sonuç isteğinin (result/xxx) **Response**'una bakın; orada `answers` veya ham puan dizisi olabilir.
