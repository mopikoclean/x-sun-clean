/* Навігація: телефон і перемикач мови (спільне для всіх сторінок) */
(function () {
  document.querySelectorAll('[data-tel]').forEach((a) => {
    if (!a.textContent.trim()) a.textContent = window.MOPIKO.phone;
    a.href = 'tel:' + window.MOPIKO.phone.replace(/[^+\d]/g, '');
  });
  document.querySelectorAll('[data-tg]').forEach((a) => {
    a.href = 'https://t.me/' + window.MOPIKO.telegram;
  });
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = 'https://wa.me/' + window.MOPIKO.whatsapp;
  });
  document.querySelectorAll('[data-email]').forEach((a) => {
    if (!a.textContent.trim()) a.textContent = window.MOPIKO.email;
    a.href = 'mailto:' + window.MOPIKO.email;
  });

  // LocalBusiness (schema.org) — для локального пошуку Google. Телефон з config,
  // мова опису — з <html lang>. Адресу додати, коли зʼявляться реквізити.
  (function injectLocalBusiness() {
    const lang = (document.documentElement.lang || 'pl').slice(0, 2);
    const data = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Mopiko clean',
      description: lang === 'uk'
        ? 'Клінінгова компанія у Познані: прибирання квартир, будинків та офісів. Фіксована ціна, власні засоби, оплата після прибирання.'
        : 'Firma sprzątająca w Poznaniu: sprzątanie mieszkań, domów i biur. Stała cena, własne środki, płatność po sprzątaniu.',
      url: 'https://mopiko.pl/',
      image: 'https://mopiko.pl/img/og-pl.png',
      telephone: window.MOPIKO.phone.replace(/[^+\d]/g, ''),
      priceRange: '185-1000 zł',
      address: { '@type': 'PostalAddress', addressLocality: 'Poznań', addressCountry: 'PL' },
      areaServed: { '@type': 'City', name: 'Poznań' },
      availableLanguage: ['pl', 'uk'],
      sameAs: ['https://t.me/' + window.MOPIKO.telegram, 'https://wa.me/' + window.MOPIKO.whatsapp],
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  })();

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
