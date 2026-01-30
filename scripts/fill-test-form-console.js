  /**
   * Test formunu tarayıcı konsolunda otomatik doldurur.
   *
   * Kullanım:
   * 1. Uygulamada /test sayfasına gidin.
   * 2. F12 ile Developer Tools açın, Console sekmesine geçin.
   * 3. Bu dosyanın TAMAMINI kopyalayıp konsola yapıştırın, Enter'a basın.
   *
   * Ne yapar:
   * - Ad Soyad, Tarih, Doğum Tarihi, Meslek/Birim, TC alanlarını doldurur (header objesindeki değerlerle).
   * - 120 soruyu answers objesine göre işaretler (1=Hiç uygun değil ... 5=Çok uygun).
   * Sonrasında sayfadaki "Gönder" butonuna siz tıklayın.
   *
   * İsim/tarih/cevapları değiştirmek için script içindeki header ve answers objelerini düzenleyin.
   */

  (function () {
    const answers = {
      1: 2, 2: 3, 3: 2, 4: 3, 5: 5,
      6: 4, 7: 2, 8: 5, 9: 4, 10: 2,
      11: 4, 12: 4, 13: 3, 14: 3, 15: 4,
      16: 1, 17: 3, 18: 4, 19: 4, 20: 5,
      21: 2, 22: 4, 23: 4, 24: 2, 25: 4,
      26: 1, 27: 2, 28: 5, 29: 4, 30: 5,
      31: 2, 32: 4, 33: 2, 34: 4, 35: 5,
      36: 4, 37: 1, 38: 3, 39: 5, 40: 4,
      41: 1, 42: 4, 43: 4, 44: 4, 45: 5,
      46: 2, 47: 3, 48: 3, 49: 5, 50: 4,
      51: 1,
      52: 4, 53: 4, 54: 2, 55: 4, 56: 1,
      57: 3, 58: 2, 59: 4, 60: 5, 61: 1,
      62: 5, 63: 2, 64: 4, 65: 4, 66: 4,
      67: 2, 68: 3, 69: 3, 70: 4,
      71: 3, 72: 4, 73: 3, 74: 3, 75: 5,
      76: 4, 77: 3, 78: 4, 79: 5, 80: 4,
      81: 1, 82: 2, 83: 4, 84: 2, 85: 4,
      86: 1, 87: 4, 88: 4, 89: 4,
      90: 5, 91: 2, 92: 2, 93: 3, 94: 3,
      95: 5, 96: 3, 97: 5, 98: 2, 99: 5,
      100: 4, 101: 1, 102: 4, 103: 3, 104: 4,
      105: 4, 106: 2, 107: 2, 108: 4,
      109: 5, 110: 5, 111: 2, 112: 1, 113: 5,
      114: 3, 115: 4, 116: 1, 117: 4, 118: 3,
      119: 2, 120: 5
    };

    const header = {
      fullName: 'Test Ad Soyad',
      date: new Date().toISOString().slice(0, 10),
      birthDate: '1990-01-15',
      department: 'Test Birim',
      tc: '12345678901'
    };

    function setNativeInputValue(el, value) {
      const proto = window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 1) Katılımcı bilgileri: ilk karttaki 5 input (Ad Soyad, Tarih, Doğum, Meslek, TC)
    const cardInputs = document.querySelectorAll('input');
    if (cardInputs.length < 5) {
      console.error('Form bulunamadı: 5 input bekleniyor.');
      return;
    }
    const [inputFullName, inputDate, inputBirth, inputDept, inputTc] = Array.from(cardInputs).slice(0, 5);
    setNativeInputValue(inputFullName, header.fullName);
    setNativeInputValue(inputDate, header.date);
    setNativeInputValue(inputBirth, header.birthDate);
    setNativeInputValue(inputDept, header.department);
    setNativeInputValue(inputTc, header.tc);
    console.log('Katılımcı bilgileri dolduruldu:', header);

    // 2) Sorular: her satır id="item_1" .. "item_120", cevap 1-5 için ilgili sütundaki butona tıkla
    for (let i = 1; i <= 120; i++) {
      const row = document.getElementById('item_' + i);
      if (!row) {
        console.warn('Satır bulunamadı: item_' + i);
        continue;
      }
      const choice = answers[i];
      if (choice < 1 || choice > 5) {
        console.warn('Geçersiz cevap soru ' + i + ':', choice);
        continue;
      }
      // Tabloda: 1. td=No, 2. td=Metin, 3-7. td=Seçenek 1..5
      const cells = row.querySelectorAll('td');
      const optionCell = cells[1 + choice]; // choice 1 -> cells[2], choice 5 -> cells[6]
      const btn = optionCell && optionCell.querySelector('button');
      if (btn) {
        btn.click();
      } else {
        console.warn('Buton bulunamadı soru ' + i + ' seçenek ' + choice);
      }
    }

    console.log('120 soru cevaplandı. İsterseniz "Gönder" butonuna tıklayın.');
  })();
