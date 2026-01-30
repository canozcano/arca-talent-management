/**
 * bigfive-test.com — TEK DÖNGÜ (turbo): Sadece yeni sayfa geldiğinde doldurur, sürekli SONRAKİ'ye basar.
 * Aynı sayfada radyoları tekrar değiştirmez; takılı kalsa bile sadece Next tıklar.
 * CEVAPLAR: generic-client ile aynı; istersen data/random-answers.json veya generic-client CEVAPLAR ile değiştir.
 * Kullanım: bigfive-test.com/tr/test veya /test → F12 → Console → yapıştır.
 */

(function () {
  var CEVAPLAR = [1,1,3,1,5,1,1,5,5,5,1,3,3,3,5,1,3,3,1,5,1,4,4,5,5,1,4,5,4,1,1,3,5,4,5,3,1,3,1,1,1,5,5,5,5,5,4,1,1,5,1,4,1,1,4,4,4,2,4,1,1,2,2,4,4,4,2,3,3,4,3,4,3,3,1,4,3,1,1,1,5,2,2,5,2,1,1,2,1,1,2,4,3,4,5,3,1,4,1,3,5,2,4,2,4,4,4,5,1,1,4,5,3,3,2,3,2,3,4,4];
  var soruIndex = 0;
  var SORU_BASINA = 5;
  var lastSignature = '';
  var INTERVAL_MS = 280;
  var MAX_ITER = 250;

  function sayfaImzasi() {
    var radios = document.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) return '';
    var r0 = radios[0];
    return (r0.name || '') + (r0.id || '') + (r0.closest && r0.closest('label') ? (r0.closest('label').textContent || '').slice(0, 40) : '');
  }

  function radioTikla(radio) {
    if (!radio || radio.checked) return;
    radio.click();
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    radio.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function sonrakiButon() {
    var all = document.querySelectorAll('button, a, [role="button"], input[type="submit"]');
    for (var i = 0; i < all.length; i++) {
      var t = (all[i].textContent || all[i].innerText || '').replace(/\s+/g, ' ').trim().toUpperCase().replace(/İ/g, 'I');
      if (t === 'SONRAKI' || t.indexOf('SONRAKI') >= 0 || t === 'NEXT') return all[i];
    }
    var btn = document.querySelectorAll('button');
    return btn.length >= 2 ? btn[1] : btn[0] || null;
  }

  function tikla(el) {
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    var r = el.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var o = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.focus();
    el.dispatchEvent(new MouseEvent('pointerdown', o));
    el.dispatchEvent(new MouseEvent('pointerup', o));
    el.dispatchEvent(new MouseEvent('click', o));
    el.click();
  }

  function adim() {
    var radios = document.querySelectorAll('input[type="radio"]');
    var sig = sayfaImzasi();

    if (radios.length >= 15 && sig && sig !== lastSignature && soruIndex < CEVAPLAR.length) {
      var n = Math.min(3, CEVAPLAR.length - soruIndex);
      for (var i = 0; i < n; i++) {
        var cevap = CEVAPLAR[soruIndex + i];
        var idx = i * SORU_BASINA + (cevap - 1);
        if (radios[idx]) radioTikla(radios[idx]);
      }
      soruIndex += n;
      lastSignature = sig;
    }

    tikla(sonrakiButon());
  }

  var iter = 0;
  var id = setInterval(function () {
    adim();
    iter++;
    if (soruIndex >= CEVAPLAR.length || iter >= MAX_ITER) {
      clearInterval(id);
      console.log('Turbo bitti. Doldurulan soru: ' + soruIndex + ', iterasyon: ' + iter + '. Sonuç sayfasındaysanız O,C,E,A,N not alın.');
    }
  }, INTERVAL_MS);

  console.log('Turbo doldurma başladı: sadece yeni sayfada doldurulur, sürekli SONRAKİ tıklanır.');
})();
