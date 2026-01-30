/**
 * bigfive-test.com/tr/test — Konsola yapıştırılacak script
 * 1. Bu sayfada F12 → Console'a yapıştır, Enter.
 * 2. 3 soru doldurulur → SONRAKİ tıklanır. Sayfa değişmediyse radyolar TEKRAR DOLDURULMAZ (takılı kalma yok).
 * 3. SONRAKİ çalışmazsa konsola "SONRAKİ'yi elle tıklayın" yazar; elle tıklayınca devam eder.
 */

(function () {
  const CEVAPLAR = [
    1,1,3,1,5,1,1,5,5,5,1,3,3,3,5,1,3,3,1,5,1,4,4,5,5,1,4,5,4,1,1,3,5,4,5,3,1,3,1,1,1,5,5,5,5,5,4,1,1,5,
    1,4,1,1,4,4,4,2,4,1,1,2,2,4,4,4,2,3,3,4,3,4,3,3,1,4,3,1,1,1,5,2,2,5,2,1,1,2,1,1,2,4,3,4,5,3,1,4,1,3,
    5,2,4,2,4,4,4,5,1,1,4,5,3,3,2,3,2,3,4,4
  ];

  let soruIndex = 0;
  const SORU_BASINA = 5;
  const RADIO_ARASI_MS = 100;
  const DOLDURMA_SONRASI_MS = 600;
  const SAYFA_GECIS_MS = 1000;
  const SONRAKI_MAX_DENEME = 4;

  function sayfaImzasi() {
    const radios = document.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) return '';
    const r0 = radios[0];
    return (r0.name || '') + (r0.id || '') + (r0.closest('label')?.textContent?.slice(0, 50) || '');
  }

  function radioTikla(radio) {
    if (!radio || radio.checked) return;
    radio.click();
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    radio.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function sonrakiButonunuBul() {
    const all = document.querySelectorAll('button, a, [role="button"], input[type="submit"]');
    for (let i = 0; i < all.length; i++) {
      const t = (all[i].textContent || all[i].innerText || '').replace(/\s+/g, ' ').trim();
      const norm = t.toUpperCase().replace(/İ/g, 'I');
      if (norm === 'SONRAKI' || norm.includes('SONRAKI') || norm === 'NEXT') return all[i];
    }
    const butonlar = document.querySelectorAll('button');
    if (butonlar.length >= 2) return butonlar[1];
    if (butonlar.length === 1) return butonlar[0];
    return null;
  }

  function geriButonunuBul() {
    const all = document.querySelectorAll('button, a, [role="button"], input[type="submit"]');
    for (let i = 0; i < all.length; i++) {
      const t = (all[i].textContent || all[i].innerText || '').replace(/\s+/g, ' ').trim();
      const norm = t.toUpperCase().replace(/İ/g, 'I');
      if (norm === 'GERİ' || norm === 'GERI' || norm === 'BACK') return all[i];
    }
    const butonlar = document.querySelectorAll('button');
    if (butonlar.length >= 2) return butonlar[0];
    return null;
  }

  function tiklaKoordinatli(btn) {
    if (!btn) return false;
    btn.scrollIntoView({ block: 'center' });
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    btn.focus();
    btn.dispatchEvent(new MouseEvent('pointerdown', opts));
    btn.dispatchEvent(new MouseEvent('pointerup', opts));
    btn.dispatchEvent(new MouseEvent('click', opts));
    btn.click();
    return true;
  }

  function sonrakiTiklaKoordinatli() {
    return tiklaKoordinatli(sonrakiButonunuBul());
  }

  function geriTikla() {
    return tiklaKoordinatli(geriButonunuBul());
  }

  function sayfaDegisti(eskiImza) {
    return sayfaImzasi() !== eskiImza;
  }

  function birSayfaDoldurSonraIlerle() {
    const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
    if (radios.length === 0 || soruIndex >= CEVAPLAR.length) {
      devamEt();
      return;
    }

    const eskiImza = sayfaImzasi();
    const sayfaSoruSayisi = Math.min(Math.floor(radios.length / SORU_BASINA) || 1, CEVAPLAR.length - soruIndex);

    function birSoruTikla(idx) {
      if (idx >= sayfaSoruSayisi) {
        setTimeout(function () {
          sonrakiTiklaVeKontrolEt(eskiImza, 0);
        }, DOLDURMA_SONRASI_MS);
        return;
      }
      const cevap = CEVAPLAR[soruIndex + idx];
      const radioIndex = idx * SORU_BASINA + (cevap - 1);
      if (radios[radioIndex]) radioTikla(radios[radioIndex]);
      setTimeout(function () { birSoruTikla(idx + 1); }, RADIO_ARASI_MS);
    }

    birSoruTikla(0);
  }

  function sonrakiTiklaVeKontrolEt(eskiImza, deneme) {
    sonrakiTiklaKoordinatli();
    setTimeout(function () {
      if (sayfaDegisti(eskiImza)) {
        soruIndex += 3;
        devamEt();
        return;
      }
      // Takılı kaldığında: Geri → kısa bekle → Sonraki (geri-ileri düzeltiyor)
      geriTikla();
      setTimeout(function () {
        sonrakiTiklaKoordinatli();
        setTimeout(function () {
          if (sayfaDegisti(eskiImza)) {
            soruIndex += 3;
            devamEt();
            return;
          }
          if (deneme < SONRAKI_MAX_DENEME - 1) {
            sonrakiTiklaVeKontrolEt(eskiImza, deneme + 1);
          } else {
            console.log('%cSONRAKİ tıklanmadı. Lütfen SONRAKİ butonuna elle tıklayın; tıkladıktan sonra script devam edecek.', 'color: orange; font-weight: bold;');
            bekleyipKontrolEt(eskiImza);
          }
        }, SAYFA_GECIS_MS);
      }, 450);
    }, SAYFA_GECIS_MS);
  }

  function bekleyipKontrolEt(eskiImza) {
    const id = setInterval(function () {
      if (sayfaDegisti(eskiImza)) {
        clearInterval(id);
        soruIndex += 3;
        console.log('Sayfa geçildi, devam ediliyor...');
        devamEt();
      }
    }, 800);
    setTimeout(function () { clearInterval(id); }, 120000);
  }

  function devamEt() {
    if (soruIndex >= CEVAPLAR.length) {
      console.log('Doldurma bitti. Toplam:', soruIndex, 'soru.');
      return;
    }
    birSayfaDoldurSonraIlerle();
  }

  console.log('bigfive-test.com otomatik doldurma (120 cevap). Sayfa değişmezse radyolar tekrar değiştirilmez.');
  setTimeout(birSayfaDoldurSonraIlerle, 500);
})();
