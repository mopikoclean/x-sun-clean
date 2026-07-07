/* Навігація: телефон і перемикач мови (спільне для всіх сторінок) */
(function () {
  document.querySelectorAll('[data-tel]').forEach((a) => {
    if (!a.textContent.trim()) a.textContent = window.XSUN.phone;
    a.href = 'tel:' + window.XSUN.phone.replace(/[^+\d]/g, '');
  });
  document.querySelectorAll('[data-tg]').forEach((a) => {
    a.href = 'https://t.me/' + window.XSUN.telegram;
  });
  document.querySelectorAll('[data-email]').forEach((a) => {
    if (!a.textContent.trim()) a.textContent = window.XSUN.email;
    a.href = 'mailto:' + window.XSUN.email;
  });

  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const langCaret = document.getElementById('langCaret');
  if (!langBtn || !langMenu) return;

  function setLangOpen(open) {
    langMenu.hidden = !open;
    langCaret.classList.toggle('open', open);
    langBtn.setAttribute('aria-expanded', String(open));
  }
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setLangOpen(langMenu.hidden);
  });
  const closeItem = langMenu.querySelector('[data-lang-close]');
  if (closeItem) closeItem.addEventListener('click', () => setLangOpen(false));
  document.addEventListener('click', (e) => {
    if (!langMenu.hidden && !langMenu.contains(e.target)) setLangOpen(false);
  });
})();
