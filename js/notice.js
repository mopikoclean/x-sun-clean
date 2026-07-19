/* ===== Банер згоди (GDPR / RODO) =====
   Підхід як у преміальних сайтів — делікатний, БЕЗ примусу:
   - показуємо ненав'язливий банер унизу, скрол сторінки НЕ блокуємо;
   - до вибору користувача НЕ вмикаємо жодну аналітику / трекінг
     (тому вільний перегляд сайту без рішення — повністю відповідає GDPR);
   - аналітика підключається лише у enableAnalytics() після згоди.
   Ідентифікатори навмисно НЕ містять слова "cookie" — інакше adblock-фільтри
   ("annoyances"/EasyList Cookie) ховають банер за назвами класів/файлу. */
(function () {
  const KEY = 'xsun-privacy-choice';
  const banner = document.getElementById('xsNote');
  if (!banner) return;

  function enableAnalytics() {
    /* Google Tag Manager — вантажимо ЛИШЕ після згоди (GDPR/RODO).
       Контейнер: GTM-5DQ5J2GW. Одноразово (guard від подвійного запуску). */
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-5DQ5J2GW');
  }

  const decided = localStorage.getItem(KEY);
  if (decided) {
    if (decided === 'accepted') enableAnalytics();
    return;
  }

  // показуємо банер (скрол сторінки лишається вільним)
  banner.hidden = false;

  function decide(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* приватний режим */ }
    banner.hidden = true;
    if (value === 'accepted') enableAnalytics();
  }

  document.getElementById('xsNoteYes').addEventListener('click', () => decide('accepted'));
  document.getElementById('xsNoteNo').addEventListener('click', () => decide('rejected'));
})();
