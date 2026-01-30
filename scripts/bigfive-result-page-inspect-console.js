/**
 * bigfive-test.com SONUÇ SAYFASINDA çalıştırın (F12 → Console).
 * İşaretlediğiniz cevapları (1–5) bulmaya çalışır; bulursa listeler.
 *
 * Kullanım: Sonuç sayfasındayken (tr/result/xxx) bu kodu yapıştırıp Enter.
 */

(function () {
  console.log('--- bigfive-test.com sonuç sayfası: cevap verisi aranıyor ---\n');

  var bulunan = null;
  var kaynak = '';

  function cevapDizisiMi(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (Array.isArray(obj)) {
      if (obj.length >= 100 && obj.length <= 150 && obj.every(function (x) { return typeof x === 'number' && x >= 1 && x <= 5; })) return true;
      return false;
    }
    var keys = Object.keys(obj);
    if (keys.length < 100) return false;
    var itemKeys = keys.filter(function (k) { return /^item[_\-]?\d+$/i.test(k) || /^q\d+$/i.test(k); });
    if (itemKeys.length >= 100) return true;
    return false;
  }

  function objedenCevaplariCikar(obj) {
    if (Array.isArray(obj)) return obj.slice(0, 120);
    var out = [];
    for (var i = 1; i <= 120; i++) {
      var v = obj['item_' + i] ?? obj['item-' + i] ?? obj['q' + i] ?? obj[i];
      if (v !== undefined) out.push(Number(v)); else out.push(null);
    }
    if (out.every(function (x) { return x === null; })) return null;
    return out;
  }

  function ara(obj, label) {
    if (!obj || typeof obj !== 'object') return;
    if (cevapDizisiMi(obj)) {
      bulunan = objedenCevaplariCikar(obj);
      kaynak = label;
      return;
    }
    if (Array.isArray(obj) && obj.length >= 100 && obj.every(function (x) { return typeof x === 'number' && x >= 1 && x <= 5; })) {
      bulunan = obj.slice(0, 120);
      kaynak = label;
      return;
    }
    if (typeof obj === 'object') {
      Object.keys(obj).slice(0, 50).forEach(function (k) {
        if (bulunan) return;
        ara(obj[k], label + '.' + k);
      });
    }
  }

  // 1) localStorage / sessionStorage
  ['localStorage', 'sessionStorage'].forEach(function (storeName) {
    var store = window[storeName];
    if (!store) return;
    for (var i = 0; i < store.length; i++) {
      var key = store.key(i);
      if (!key || bulunan) continue;
      try {
        var val = store.getItem(key);
        if (val && (val.startsWith('{') || val.startsWith('['))) {
          var parsed = JSON.parse(val);
          ara(parsed, storeName + '.' + key);
        }
      } catch (e) {}
    }
  });

  // 2) __NEXT_DATA__ (Next.js)
  var nextData = document.getElementById('__NEXT_DATA__');
  if (nextData && !bulunan) {
    try {
      var data = JSON.parse(nextData.textContent);
      ara(data, '__NEXT_DATA__');
    } catch (e) {}
  }

  // 3) window global state
  ['__NEXT_DATA__', '__INITIAL_STATE__', '__data__', '__APOLLO_STATE__', 'result', 'testResult', 'answers'].forEach(function (key) {
    if (bulunan) return;
    var w = window[key];
    if (w) ara(w, 'window.' + key);
  });

  // 4) Sonuç sayfası URL'den ID ile API cevabı olabilir; Network'tan bakılmalı
  if (bulunan) {
    console.log('Cevaplar bulundu (kaynak: ' + kaynak + '):\n');
    var arr = Array.isArray(bulunan) ? bulunan : Object.keys(bulunan).sort(function (a, b) {
      var an = parseInt((a + '').replace(/\D/g, ''), 10) || 0;
      var bn = parseInt((b + '').replace(/\D/g, ''), 10) || 0;
      return an - bn;
    }).map(function (k) { return bulunan[k]; });
    console.log('Dizi (1–120):', JSON.stringify(arr));
    console.log('\nitem_1 .. item_120 formatında kopyalamak için:');
    var obj = {};
    arr.forEach(function (v, i) { obj['item_' + (i + 1)] = v; });
    console.log(JSON.stringify({ answers: obj }, null, 2));
  } else {
    console.log('Sayfa verisi içinde 120 cevaplık dizi bulunamadı.\n');
    console.log('Yapabilecekleriniz:');
    console.log('1) Network sekmesini açın (F12 → Network). Sayfayı yenileyin. "result" veya "697ca45" gibi isteği bulun; Response\'ta "answers" veya "scores" arayın.');
    console.log('2) Application → Local Storage / Session Storage → bigfive-test.com; "result", "test", "answers" gibi anahtarlara bakın.');
    console.log('3) Bu sayfa cevapları sunucuda tutuyor ve HTML\'e yazmıyorsa, sadece skorlar dönüyor olabilir; ham cevaplar API\'de olmayabilir.');
  }
})();
