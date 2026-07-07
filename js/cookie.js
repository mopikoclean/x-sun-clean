/* ===== Банер згоди на cookie (GDPR / RODO) =====
   До того, як користувач зробить вибір:
   - показуємо банер із затемненням сторінки;
   - блокуємо прокрутку, щоб рішення було свідомим;
   - НЕ вмикаємо жодну аналітику / трекінг.
   Аналітика підключається лише у enableAnalytics() після згоди. */
(function () {
  const KEY = 'xsun-cookie-consent';
  const banner = document.getElementById('cookieBanner');
  const overlay = document.getElementById('cookieOverlay');
  if (!banner || !overlay) return;

  function enableAnalytics() {
    /* Тут підключайте аналітичні скрипти (напр. Google Analytics) —
       вони мають завантажуватися ВИКЛЮЧНО після згоди користувача. */
  }

  const decided = localStorage.getItem(KEY);
  if (decided) {
    if (decided === 'accepted') enableAnalytics();
    return;
  }

  // блокуємо прокрутку, фіксуючи body (надійно для всіх браузерів)
  let savedY = 0;
  function lockScroll() {
    savedY = window.scrollY || 0;
    document.body.style.top = -savedY + 'px';
    document.documentElement.classList.add('cookie-lock');
  }
  function unlockScroll() {
    document.documentElement.classList.remove('cookie-lock');
    document.body.style.top = '';
    window.scrollTo(0, savedY);
  }

  // показуємо банер і блокуємо сторінку
  overlay.hidden = false;
  banner.hidden = false;
  lockScroll();

  function decide(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* приватний режим */ }
    banner.hidden = true;
    overlay.hidden = true;
    unlockScroll();
    if (value === 'accepted') enableAnalytics();
    if (window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(), 60);
  }

  document.getElementById('cookieAccept').addEventListener('click', () => decide('accepted'));
  document.getElementById('cookieReject').addEventListener('click', () => decide('rejected'));
})();
