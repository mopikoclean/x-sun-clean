/* ===== Банер згоди на cookie (GDPR / RODO) =====
   Підхід як у преміальних сайтів — делікатний, БЕЗ примусу:
   - показуємо ненав'язливий банер унизу, скрол сторінки НЕ блокуємо;
   - до вибору користувача НЕ вмикаємо жодну аналітику / трекінг
     (тому вільний перегляд сайту без рішення — повністю відповідає GDPR);
   - аналітика підключається лише у enableAnalytics() після згоди. */
(function () {
  const KEY = 'xsun-cookie-consent';
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  function enableAnalytics() {
    /* Тут підключайте аналітичні скрипти (напр. Google Analytics) —
       вони мають завантажуватися ВИКЛЮЧНО після згоди користувача. */
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

  document.getElementById('cookieAccept').addEventListener('click', () => decide('accepted'));
  document.getElementById('cookieReject').addEventListener('click', () => decide('rejected'));
})();
