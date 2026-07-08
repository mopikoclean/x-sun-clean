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

  document.getElementById('xsNoteYes').addEventListener('click', () => decide('accepted'));
  document.getElementById('xsNoteNo').addEventListener('click', () => decide('rejected'));
})();
