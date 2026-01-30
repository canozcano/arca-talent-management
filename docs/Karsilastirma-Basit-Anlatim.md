# Karşılaştırma Nasıl Yapılır? (Basit Anlatım)

## Ne yapıyoruz?

**Aynı 120 soruya aynı cevapları veriyoruz** → Üç yerde skor alıyoruz → **Yan yana koyup bakıyoruz.**

---

## Üç yer neresi?

1. **Bizim sitemiz (ARCA)** — Kendi programımız skorları hesaplıyor.
2. **Referans program** — Aynı formülü kullanan, sadece skor hesaplayan küçük bir script (kontrol için).
3. **bigfive-test.com** — Aynı cevapları bu sitede işaretleyip, sitenin verdiği skorlara bakıyoruz.

---

## Adım adım ne yapacağım?

### Adım 1: Bir cevap listesi seç

- Ya **hazır liste** kullan: `data/generic-client-answers.json`
- Ya **rastgele liste** üret:
  ```bash
  cd arca-web
  npx tsx scripts/random-answers-and-score.ts
  ```
  Bu komut `data/random-answers.json` dosyasını oluşturur.

### Adım 2: Bizim skorları gör

Terminalde:

```bash
cd arca-web
npx tsx scripts/compare-sources.ts data/generic-client-answers.json
```

(İstersen `data/random-answers.json` da yazabilirsin.)

Ekranda bir tablo çıkar:

| Faktör | ARCA (bizim) | Referans | bigfive-test.com |
|--------|--------------|----------|------------------|
| O      | 83           | 83       | –                |
| C      | 105          | 105      | –                |
| ...    | ...          | ...      | –                |

Şimdilik **bigfive-test.com** sütunu boş (–). İlk iki sütun (ARCA ve Referans) **aynı cevapla aynı skoru** vermeli.

### Adım 3: Aynı cevapları bigfive-test.com’da işaretle

- bigfive-test.com/tr/test sayfasını aç.
- Projede `data/random-answers.json` veya `data/generic-client-answers.json` dosyasını aç; içindeki **CEVAPLAR** (120 sayı) satırını kopyala.
- `scripts/bigfive-test-com-fill-console.js` dosyasını aç; içindeki **CEVAPLAR** satırını sil, yerine kopyaladığın 120 sayıyı yapıştır. Scriptin geri kalanına dokunma.
- bigfive-test.com sayfasında F12 → Console’u aç, bu scripti yapıştırıp Enter’a bas. Test otomatik dolar.
- Test bitince **sonuç sayfasındaki** O, C, E, A, N sayılarını bir yere not et (örn. 85, 76, 77, 73, 78).

### Adım 4: bigfive skorlarını tabloya ekle

Terminalde tekrar çalıştır, bu sefer bigfive sayılarını ver:

```bash
npx tsx scripts/compare-sources.ts data/generic-client-answers.json --bigfive 85,76,77,73,78
```

(O, C, E, A, N sırasıyla; senin not ettiğin sayılarla değiştir.)

Bu sefer tabloda üç sütun da dolu olur. **Bizim skorlar** ile **bigfive skorları** yan yana görünür.

---

## Kısaca

1. **Bir cevap listesi** seç (generic-client veya random-answers).
2. **compare-sources** çalıştır → Bizim ve referans skorları tabloda çıkar.
3. **Aynı listeyi** bigfive-test.com’da scriptle doldur → Sonuç sayfasındaki O,C,E,A,N’ı al.
4. **compare-sources**’u bigfive sayılarıyla tekrar çalıştır → Üç sütunlu karşılaştırma tablosu hazır.

Böylece **aynı sorulara aynı cevapları** hem bizim sistemde hem bigfive’ta kullanmış olursun; fark varsa tabloda görürsün.
