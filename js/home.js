/* ===== X-sun clean — головна сторінка ===== */

const $ = (id) => document.getElementById(id);
const fmt = (n) => String(Math.round(n));

// Користувач попросив менше руху — поважаємо на рівні всієї сторінки.
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Мова сторінки (з <html lang>) — для текстів, що рендеряться з JS.
const PLANG = (document.documentElement.lang || 'uk').slice(0, 2);
const pick = (dict) => dict[PLANG] || dict.uk;

/* ---- калькулятор у hero ---- */
const calc = { rooms: 2, baths: 1 };
/* Модель «база + кімнати» — синхронно з order.js:
   база 95 (виїзд, кухня, коридор) + кімната 40 + санвузол 50. */
const basePrice = (r, b) => 95 + r * 40 + b * 50;

// кнопки замовлення поруч із калькулятором несуть обрані кімнати/санвузли
// далі — на сторінку замовлення, щоб не вводити їх заново
function syncCalcOrderLinks() {
  const q = '?rooms=' + calc.rooms + '&baths=' + calc.baths;
  // шлях форми замовлення відповідно до мови сторінки
  const orderUrl = PLANG === 'pl' ? '/pl/zamovlennya.html' : '/zamovlennya.html';
  document.querySelectorAll('.js-calc-order').forEach((a) => { a.href = orderUrl + q; });
}
syncCalcOrderLinks();

document.querySelectorAll('.step-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.step;
    calc[key] = Math.max(1, Math.min(9, calc[key] + Number(btn.dataset.dir)));
    $('roomsVal').textContent = calc.rooms;
    $('bathsVal').textContent = calc.baths;
    $('calcPrice').textContent = fmt(basePrice(calc.rooms, calc.baths));
    syncCalcOrderLinks();
    if (window.gsap && !REDUCE) {
      window.gsap.fromTo('[data-price-el]',
        { scale: 1.12, color: '#E8A100' },
        { scale: 1, color: '#141414', duration: 0.45, ease: 'power2.out' });
    }
  });
});

/* ---- ціни: періодичність + доп. опції ---- */
const DISC = { once: 0, month: 0.10, two: 0.15, week: 0.20 };
const PERIOD_LABELS = pick({
  uk: {
    once: 'разове прибирання',
    week: 'щотижня (−20%)',
    two: 'раз на два тижні (−15%)',
    month: 'раз на місяць (−10%)',
  },
  pl: {
    once: 'sprzątanie jednorazowe',
    week: 'co tydzień (−20%)',
    two: 'co dwa tygodnie (−15%)',
    month: 'raz w miesiącu (−10%)',
  },
});
const priceState = { period: 'once' };

document.querySelectorAll('.pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    priceState.period = pill.dataset.period;
    renderPrices();
  });
});

function renderPrices() {
  const disc = DISC[priceState.period];
  document.querySelectorAll('.pill').forEach((pill) => {
    pill.classList.toggle('active', pill.dataset.period === priceState.period);
  });
  document.querySelectorAll('[data-p]').forEach((el) => {
    el.textContent = fmt(Number(el.dataset.p) * (1 - disc));
  });
  document.querySelectorAll('[data-period-label]').forEach((el) => {
    el.textContent = PERIOD_LABELS[priceState.period];
  });
}
renderPrices();

/* ---- слайдер + галерея «до / після» ---- */
const BA_LABELS = pick({
  uk: ["Під'їзд після ремонту", 'Газова плита'],
  pl: ['Klatka schodowa po remoncie', 'Kuchenka gazowa'],
});
const BA_WORDS = pick({
  uk: { before: 'до', after: 'після', example: 'Приклад: ' },
  pl: { before: 'przed', after: 'po', example: 'Przykład: ' },
});
const BA_ITEMS = [
  { before: '/img/ba-before.webp', after: '/img/ba-after.webp', label: BA_LABELS[0] },
  { before: '/img/ba2-before.webp', after: '/img/ba2-after.webp', label: BA_LABELS[1] },
];
let baIdx = 0;

function setSlider(pct) {
  $('baBefore').style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  $('baDivider').style.left = pct + '%';
}
$('baRange').addEventListener('input', (e) => setSlider(Number(e.target.value)));

function showBA(i) {
  baIdx = (i + BA_ITEMS.length) % BA_ITEMS.length;
  const it = BA_ITEMS[baIdx];
  $('baBeforeImg').src = it.before;
  $('baAfterImg').src = it.after;
  $('baBeforeImg').alt = it.label + ' — ' + BA_WORDS.before;
  $('baAfterImg').alt = it.label + ' — ' + BA_WORDS.after;
  $('baRange').value = 50;
  setSlider(50);
  dotsWrap.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === baIdx));
}

const dotsWrap = $('baDots');
BA_ITEMS.forEach((it, i) => {
  const d = document.createElement('button');
  d.type = 'button';
  d.setAttribute('aria-label', BA_WORDS.example + it.label);
  d.addEventListener('click', () => showBA(i));
  dotsWrap.appendChild(d);
});
$('baPrev').addEventListener('click', () => showBA(baIdx - 1));
$('baNext').addEventListener('click', () => showBA(baIdx + 1));
showBA(0);

/* ---- відгуки: горизонтальна навігація ---- */
(function reviewsNav() {
  const track = $('reviewsTrack');
  if (!track) return;
  const step = () => (track.querySelector('.review-card') || {}).offsetWidth + 20 || 400;
  $('revPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('revNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
})();

/* ---- FAQ ---- */
const FAQS = pick({
  uk: [
    { q: 'Чи потрібно надавати свої засоби для прибирання?', a: 'Ні. Ми приїжджаємо з усім необхідним: професійна хімія, інвентар, пилосос. Вам достатньо відчинити двері.' },
    { q: 'Як відбувається оплата?', a: 'Після завершення прибирання, коли ви прийняли роботу. Карткою, готівкою або переказом — як вам зручно. Без передоплат.' },
    { q: 'Чи видаєте фактуру VAT?', a: 'Так, для компаній та офісів надаємо фактуру VAT і працюємо за договором.' },
    { q: 'Скільки триває прибирання?', a: 'Звичайне прибирання 1-кімнатної квартири — приблизно 2–3 години, 2-кімнатної — 3–4. Точний час залежить від стану приміщення.' },
    { q: 'Чи можна замовити регулярне прибирання?', a: 'Так, це найвигідніший формат: раз на тиждень −20%, раз на два тижні −15%, раз на місяць −10%. Приїжджає той самий виконавець.' },
    { q: 'Чи виїжджаєте за межі Познані?', a: 'Наразі працюємо в межах Познані. Найближчі околиці — за домовленістю, напишіть нам.' },
  ],
  pl: [
    { q: 'Czy trzeba zapewnić własne środki do sprzątania?', a: 'Nie. Przyjeżdżamy z wszystkim, co potrzebne: profesjonalna chemia, sprzęt, odkurzacz. Wystarczy, że otworzysz drzwi.' },
    { q: 'Jak wygląda płatność?', a: 'Po zakończeniu sprzątania, gdy odbierzesz pracę. Kartą, gotówką lub przelewem — jak Ci wygodnie. Bez przedpłat.' },
    { q: 'Czy wystawiacie fakturę VAT?', a: 'Tak, dla firm i biur wystawiamy fakturę VAT i pracujemy na podstawie umowy.' },
    { q: 'Ile trwa sprzątanie?', a: 'Standardowe sprzątanie mieszkania 1-pokojowego to około 2–3 godzin, 2-pokojowego — 3–4. Dokładny czas zależy od stanu lokalu.' },
    { q: 'Czy można zamówić sprzątanie regularne?', a: 'Tak, to najkorzystniejszy format: co tydzień −20%, co dwa tygodnie −15%, raz w miesiącu −10%. Przyjeżdża ten sam wykonawca.' },
    { q: 'Czy dojeżdżacie poza Poznań?', a: 'Na razie pracujemy w granicach Poznania. Najbliższe okolice — po uzgodnieniu, napisz do nas.' },
  ],
});

const faqList = $('faqList');
FAQS.forEach((f, i) => {
  const item = document.createElement('div');
  item.className = 'faq-item' + (i === 0 ? ' open' : '');
  item.setAttribute('data-reveal', '');
  item.innerHTML =
    '<button type="button" class="faq-q" aria-expanded="' + (i === 0) + '">' +
      '<span class="q"></span><span class="faq-icon">+</span>' +
    '</button>' +
    '<div class="faq-a-wrap"><div><p class="faq-a"></p></div></div>';
  item.querySelector('.q').textContent = f.q;
  item.querySelector('.faq-a').textContent = f.a;
  item.querySelector('.faq-q').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    faqList.querySelectorAll('.faq-item').forEach((el) => {
      el.classList.remove('open');
      el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('open');
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
    }
  });
  faqList.appendChild(item);
});

/* ---- плаваюча кнопка ---- */
const fab = $('fab');
const fabItems = $('fabItems');
$('fabBtn').addEventListener('click', () => {
  const open = fab.classList.toggle('open');
  fabItems.hidden = !open;
});
document.querySelectorAll('[data-tel-fab]').forEach((a) => {
  a.href = 'tel:' + window.XSUN.phone.replace(/[^+\d]/g, '');
});

/* ---- анімації (GSAP + ScrollTrigger) ---- */
(function initAnimations() {
  // Повага до prefers-reduced-motion: жодного руху. Контент і так видимий у CSS
  // (елементи ховає лише GSAP), а секцію «Послуги» робимо звичайним скролом (див. home.css).
  if (REDUCE) return;
  if (!window.gsap || !window.ScrollTrigger) { setTimeout(initAnimations, 150); return; }
  const g = window.gsap;
  g.registerPlugin(window.ScrollTrigger);

  g.set('[data-w]', { y: '110%' });
  g.to('[data-w]', { y: '0%', duration: 1, stagger: 0.09, ease: 'power4.out', delay: 0.15 });
  g.from('[data-hero-calc]', { y: 40, opacity: 0, duration: 1, delay: 0.5, ease: 'power3.out' });

  g.to('[data-hero-glow]', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
  });

  g.utils.toArray('[data-reveal]').forEach((el) => {
    g.fromTo(el, { y: 36, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  g.from('.svc-card', {
    y: 70, opacity: 0, stagger: 0.09, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#poslugy', start: 'top 75%', once: true },
  });

  // процес: номер з "пружиною", лінія малюється, за нею біжить світлова точка
  const steps = g.utils.toArray('.steps-grid .step');
  if (steps.length) {
    const tl = g.timeline({
      scrollTrigger: { trigger: '.steps-grid', start: 'top 80%', once: true },
    });
    steps.forEach((step, i) => {
      const num = step.querySelector('.step-num');
      const line = step.querySelector('[data-line]');
      const spark = step.querySelector('[data-spark]');
      tl.from(step, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, i === 0 ? 0 : '-=0.25');
      if (num) tl.from(num, { scale: 0, duration: 0.55, ease: 'back.out(2)' }, '<0.05');
      if (line) tl.to(line, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.2');
      if (spark) tl.fromTo(spark, { left: '0%', opacity: 1 }, { left: '100%', opacity: 0, duration: 0.5, ease: 'power1.in' }, '<');
    });
  }

  const mm = g.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const track = document.querySelector('.svc-track');
    const pin = document.querySelector('.svc-pin');
    if (!track || !pin) return;
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
    const tween = g.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      g.set(track, { x: 0 });
    };
  });

  setTimeout(() => window.ScrollTrigger.refresh(), 600);
})();
