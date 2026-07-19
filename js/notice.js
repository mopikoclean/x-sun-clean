/* ===== Банер згоди (GDPR / RODO) + Google Consent Mode v2 =====
   Категорії: необхідні (завжди активні), аналітика, маркетинг.
   GTM вантажиться в <head> (consent-init.js) із дефолтом "denied".
   Тут ми: показуємо банер (без примусу, скрол не блокуємо), даємо гранулярний
   вибір і оновлюємо Google Consent Mode через window.gtag. Вибір зберігаємо
   у localStorage; є посилання у футері, щоб змінити рішення пізніше. */
(function () {
  const KEY = 'mopiko-consent';
  const banner = document.getElementById('xsNote');
  if (!banner) return;

  const LANG = (document.documentElement.lang || 'uk').slice(0, 2);
  const DICT = {
    uk: {
      title: 'Ми поважаємо вашу приватність',
      intro: 'Ми використовуємо cookie для роботи сайту, аналітики та реклами. Необхідні завжди активні — аналітику й маркетинг вмикаємо лише з вашої згоди.',
      privacy: 'Політика конфіденційності', privacyHref: '/privacy.html',
      acceptAll: 'Прийняти всі', onlyNec: 'Тільки необхідні', settings: 'Налаштування',
      save: 'Зберегти вибір',
      nec: ['Необхідні', 'Потрібні для роботи сайту. Завжди активні.'],
      ana: ['Аналітика', 'Анонімна статистика, щоб покращувати сайт.'],
      mar: ['Маркетинг', 'Реклама й ремаркетинг (Google Ads, Meta).'],
      reopen: 'Налаштування приватності',
    },
    pl: {
      title: 'Szanujemy Twoją prywatność',
      intro: 'Używamy plików cookie do działania strony, analityki i reklamy. Niezbędne są zawsze aktywne — analitykę i marketing włączamy tylko za Twoją zgodą.',
      privacy: 'Polityka prywatności', privacyHref: '/privacy.html',
      acceptAll: 'Zaakceptuj wszystkie', onlyNec: 'Tylko niezbędne', settings: 'Ustawienia',
      save: 'Zapisz wybór',
      nec: ['Niezbędne', 'Potrzebne do działania strony. Zawsze aktywne.'],
      ana: ['Analityka', 'Anonimowe statystyki, by ulepszać stronę.'],
      mar: ['Marketing', 'Reklama i remarketing (Google Ads, Meta).'],
      reopen: 'Ustawienia prywatności',
    },
  };
  const T = DICT[LANG] || DICT.uk;
  const $ = (id) => document.getElementById(id);

  function apply(c) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
    });
  }

  function save(c) {
    const val = { necessary: true, analytics: !!c.analytics, marketing: !!c.marketing };
    try { localStorage.setItem(KEY, JSON.stringify(val)); } catch (e) { /* приватний режим */ }
    apply(val);
    banner.hidden = true;
  }

  function cat(id, t, checked, locked) {
    return '<label class="xs-cat">' +
      '<span class="xs-cat-info"><span class="xs-cat-t">' + t[0] + '</span>' +
      '<span class="xs-cat-d">' + t[1] + '</span></span>' +
      '<span class="xs-switch' + (locked ? ' is-locked' : '') + '">' +
        '<input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') + (locked ? ' disabled' : '') + '>' +
        '<span class="xs-switch-track"></span></span></label>';
  }

  banner.innerHTML =
    '<div class="xs-note-text">' +
      '<strong>' + T.title + '</strong>' +
      '<p>' + T.intro + ' <a href="' + T.privacyHref + '" target="_blank" rel="noopener">' + T.privacy + '</a>.</p>' +
    '</div>' +
    '<div class="xs-note-panel" id="xsPanel" hidden>' +
      cat('xsNec', T.nec, true, true) +
      cat('xsAna', T.ana, false, false) +
      cat('xsMar', T.mar, false, false) +
    '</div>' +
    '<div class="xs-note-actions" id="xsActions">' +
      '<button type="button" class="xs-settings-link" id="xsSet">' + T.settings + '</button>' +
      '<button type="button" class="btn btn-ghost magnet" id="xsOnly">' + T.onlyNec + '</button>' +
      '<button type="button" class="btn btn-primary magnet" id="xsAll">' + T.acceptAll + '</button>' +
    '</div>' +
    '<div class="xs-note-actions" id="xsSaveRow" hidden>' +
      '<button type="button" class="btn btn-primary btn-block magnet" id="xsSave">' + T.save + '</button>' +
    '</div>';

  function openSettings(prefill) {
    if (prefill) {
      $('xsAna').checked = !!prefill.analytics;
      $('xsMar').checked = !!prefill.marketing;
    }
    $('xsPanel').hidden = false;
    $('xsActions').hidden = true;
    $('xsSaveRow').hidden = false;
    banner.classList.add('is-open');
  }

  $('xsAll').addEventListener('click', () => save({ analytics: true, marketing: true }));
  $('xsOnly').addEventListener('click', () => save({ analytics: false, marketing: false }));
  $('xsSet').addEventListener('click', () => openSettings());
  $('xsSave').addEventListener('click', () => save({ analytics: $('xsAna').checked, marketing: $('xsMar').checked }));

  // право змінити рішення пізніше — посилання у футері
  window.mopikoConsentOpen = function () {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    banner.hidden = false;
    openSettings(stored || { analytics: false, marketing: false });
  };
  (function footerLink() {
    const ref = document.querySelector('.foot-link');
    if (!ref) return;
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'foot-link';
    a.textContent = T.reopen;
    a.addEventListener('click', (e) => { e.preventDefault(); window.mopikoConsentOpen(); });
    ref.parentNode.insertBefore(a, ref.nextSibling);
  })();

  // показуємо банер лише якщо вибору ще не було (consent-init.js уже застосував збережене)
  let decided = null;
  try { decided = localStorage.getItem(KEY); } catch (e) {}
  if (!decided) banner.hidden = false;
})();
