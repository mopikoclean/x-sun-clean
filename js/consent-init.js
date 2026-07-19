/* ===== Google Consent Mode v2 + Google Tag Manager =====
   Вантажиться в <head> ДО решти скриптів (синхронно).
   Дефолт для аналітики й реклами — "denied": GTM стартує одразу, але теги
   працюють у cookieless-режимі (лише анонімні пінги для моделювання
   конверсій Google Ads) і НЕ ставлять cookie / не збирають персональні дані,
   доки користувач не дасть згоду. Згоду оновлює notice.js через window.gtag.
   Контейнер: GTM-5DQ5J2GW. */
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  // застосувати збережений вибір якомога раніше — до спрацювання тегів
  try {
    var c = JSON.parse(localStorage.getItem('mopiko-consent'));
    if (c) {
      gtag('consent', 'update', {
        ad_storage: c.marketing ? 'granted' : 'denied',
        ad_user_data: c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied',
        analytics_storage: c.analytics ? 'granted' : 'denied',
      });
    }
  } catch (e) { /* приватний режим */ }

  // Google Tag Manager
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
})();
