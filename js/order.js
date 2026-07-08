/* ===== X-sun clean — калькулятор замовлення ===== */

const CONFIG = window.XSUN;

/* Тексти повідомлення для месенджера — мова береться з <html lang>.
   Коли з'являться PL/EN версії сайту, достатньо додати словник сюди. */
const MESSAGES = {
  uk: {
    greeting: 'Вітаю! 👋 Планую замовити у вас прибирання. Ось деталі:',
    closing: 'Підкажіть, будь ласка, чи вільна ця дата? Дякую!',
    flat: 'Квартира', house: 'Приватний будинок', renovation: 'Після ремонту',
    type: 'Тип', area: 'Площа', period: 'Періодичність', extras: 'Додатково',
    date: 'Бажана дата', time: 'Зручний час', price: 'Орієнтовна вартість',
    promo: 'Промокод', name: "Ім'я", phone: 'Телефон', email: 'Email', comment: 'Коментар',
    kitchen: 'Кухня', duration: 'Орієнтовна тривалість',
    kitchenStudioShort: 'студія', kitchenFullShort: 'окрема',
    sqm: 'м²', areaWord: 'площа', onceShort: 'разове', roomsShort: 'кімн.',
    durHour: 'год', durMin: '30 хв', approx: '≈',
    roomsForms: ['кімната', 'кімнати', 'кімнат'],
    bathsForms: ['санвузол', 'санвузли', 'санвузлів'],
    discount: 'Знижка',
    contactName: 'Мене звати', contactNum: 'мій номер', contactNumOnly: 'Мій номер:',
    cbLabel: 'Надіслати заявку', unitWindow: 'вікно',
    promoApplied: 'Промокод {code} застосовано: −{n}%',
    promoNotFound: 'Промокод не знайдено',
    leadUnavailable: 'Форма тимчасово недоступна — зателефонуйте нам: {phone}',
    leadSending: 'Надсилаємо…',
    leadFailed: 'Не вдалося надіслати. Спробуйте ще раз або зателефонуйте: {phone}',
    periods: {
      once: { label: 'Разове' },
      month: { label: 'Раз на місяць' },
      two: { label: 'Раз на два тижні' },
      week: { label: 'Раз на тиждень' },
    },
    save: 'економія', popular: 'популярно',
    times: { any: 'Будь-який час', morning: 'Ранок (8–12)', day: 'День (12–16)', evening: 'Вечір (16–20)' },
    extrasLabels: { oven: 'Духовка', fridge: 'Холодильник', micro: 'Мікрохвильовка', windows: 'Миття вікон', balcony: 'Балкон', iron: 'Прасування', dishes: 'Миття посуду', cabinets: 'Прибрати в шафі' },
  },
  pl: {
    greeting: 'Witam! 👋 Chcę zamówić u Państwa sprzątanie. Oto szczegóły:',
    closing: 'Proszę o info, czy ten termin jest wolny? Dziękuję!',
    flat: 'Mieszkanie', house: 'Dom prywatny', renovation: 'Po remoncie',
    type: 'Typ', area: 'Powierzchnia', period: 'Częstotliwość', extras: 'Dodatkowo',
    date: 'Preferowana data', time: 'Dogodny czas', price: 'Cena orientacyjna',
    promo: 'Kod promocyjny', name: 'Imię', phone: 'Telefon', email: 'Email', comment: 'Komentarz',
    kitchen: 'Kuchnia', duration: 'Orientacyjny czas',
    kitchenStudioShort: 'w aneksie', kitchenFullShort: 'osobna',
    sqm: 'm²', areaWord: 'powierzchnia', onceShort: 'jednorazowo', roomsShort: 'pok.',
    durHour: 'godz.', durMin: '30 min', approx: '≈',
    roomsForms: ['pokój', 'pokoje', 'pokoi'],
    bathsForms: ['łazienka', 'łazienki', 'łazienek'],
    discount: 'Rabat',
    contactName: 'Mam na imię', contactNum: 'mój numer', contactNumOnly: 'Mój numer:',
    cbLabel: 'Wyślij zgłoszenie', unitWindow: 'okno',
    promoApplied: 'Kod {code} zastosowany: −{n}%',
    promoNotFound: 'Nie znaleziono kodu',
    leadUnavailable: 'Formularz chwilowo niedostępny — zadzwoń: {phone}',
    leadSending: 'Wysyłanie…',
    leadFailed: 'Nie udało się wysłać. Spróbuj ponownie lub zadzwoń: {phone}',
    periods: {
      once: { label: 'Jednorazowo' },
      month: { label: 'Raz w miesiącu' },
      two: { label: 'Co dwa tygodnie' },
      week: { label: 'Co tydzień' },
    },
    save: 'oszczędność', popular: 'popularne',
    times: { any: 'Dowolna pora', morning: 'Rano (8–12)', day: 'Dzień (12–16)', evening: 'Wieczór (16–20)' },
    extrasLabels: { oven: 'Piekarnik', fridge: 'Lodówka', micro: 'Mikrofalówka', windows: 'Mycie okien', balcony: 'Balkon', iron: 'Prasowanie', dishes: 'Zmywanie naczyń', cabinets: 'Porządek w szafie' },
  },
};
const PAGE_LANG = (document.documentElement.lang || 'uk').slice(0, 2);
const T = MESSAGES[PAGE_LANG] || MESSAGES.uk;

const PERIODS = [
  { id: 'once', disc: 0 },
  { id: 'month', disc: 0.10 },
  { id: 'two', disc: 0.15 },
  { id: 'week', disc: 0.20 },
].map((p) => ({ ...p, label: T.periods[p.id].label }));

const EXTRAS = [
  { id: 'oven', price: 40 },
  { id: 'fridge', price: 40 },
  { id: 'micro', price: 18 },
  { id: 'windows', price: 40, perUnit: true },
  { id: 'balcony', price: 30 },
  { id: 'iron', price: 45 },
  { id: 'dishes', price: 25 },
  { id: 'cabinets', price: 30 },
].map((x) => ({ ...x, label: T.extrasLabels[x.id], ...(x.perUnit ? { unit: T.unitWindow } : {}) }));

// Іконки опцій — лінійний стиль сайту (основні лінії currentColor, одна золота деталь).
// currentColor → іконка стає золотою разом із карткою у стані .on.
const ICO = (inner) =>
  '<svg class="extra-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
const ICONS = {
  oven: ICO('<rect x="4" y="4" width="24" height="24" rx="3"/><line x1="4" y1="10.5" x2="28" y2="10.5"/>' +
    '<circle class="acc-fill" cx="19" cy="7.2" r="1.1"/><circle class="acc-fill" cx="23" cy="7.2" r="1.1"/>' +
    '<rect x="8" y="14" width="16" height="9.5" rx="1.5"/>'),
  fridge: ICO('<rect x="8" y="3" width="16" height="26" rx="3"/><line x1="8" y1="13" x2="24" y2="13"/>' +
    '<line class="acc" x1="20" y1="6.5" x2="20" y2="10"/><line class="acc" x1="20" y1="16" x2="20" y2="21"/>'),
  micro: ICO('<rect x="3" y="7" width="26" height="18" rx="3"/><rect x="6" y="10" width="14" height="12" rx="1.5"/>' +
    '<circle class="acc-fill" cx="24" cy="12" r="1"/><circle class="acc-fill" cx="24" cy="15" r="1"/>' +
    '<line x1="22.5" y1="19" x2="25.5" y2="19"/>'),
  windows: ICO('<rect x="4" y="5" width="15" height="19" rx="1.5"/><line x1="11.5" y1="5" x2="11.5" y2="24"/>' +
    '<line x1="4" y1="14.5" x2="19" y2="14.5"/><path class="acc" d="M25 6 L25 12 M22 9 L28 9"/>'),
  balcony: ICO('<line x1="4" y1="26" x2="28" y2="26"/><line x1="5" y1="13" x2="27" y2="13"/>' +
    '<line x1="9" y1="13" x2="9" y2="26"/><line x1="15" y1="13" x2="15" y2="26"/><line x1="21" y1="13" x2="21" y2="26"/>' +
    '<path class="acc" d="M24 12.5 C21.5 10.5 22.5 7 24 6.5 C25.5 7 26.5 10.5 24 12.5 Z"/>'),
  iron: ICO('<path d="M6 21 L25 21 L25 18 C25 14 22 13 18 13 L11 13 C8 13 6 15 6 18 Z"/>' +
    '<path d="M11 13 C11 9 19 9 19 13"/>' +
    '<path class="acc" d="M26 8 C27.2 9 25 10 26 11.2"/><path class="acc" d="M22 6.5 C23.2 7.5 21 8.5 22 9.7"/>'),
  dishes: ICO('<circle cx="13" cy="17" r="9"/><circle cx="13" cy="17" r="4.3"/>' +
    '<circle class="acc" cx="25" cy="8" r="2"/><circle class="acc-fill" cx="21" cy="4.5" r="1"/>'),
  cabinets: ICO('<rect x="6" y="4" width="20" height="24" rx="2"/><line x1="16" y1="4" x2="16" y2="28"/>' +
    '<circle class="acc-fill" cx="14" cy="16" r="1.1"/><circle class="acc-fill" cx="18" cy="16" r="1.1"/>'),
};

const TIMES = T.times;

const RENO_RATE = 6; // zł за м² після ремонту

const state = {
  type: 'flat',
  rooms: 2,
  baths: 1,
  area: 50,
  kitchen: 'full',
  period: 'once',
  extrasQty: {},
  name: '',
  dial: '+48',
  phone: '',
  date: '',
  time: 'any',
  comment: '',
  consent: false,
  promoCode: '',
  promoDisc: 0,
};

const $ = (id) => document.getElementById(id);
const fmt = (n) => String(Math.round(n));

// попередній вибір із калькулятора на головній (?rooms=&baths=)
(function prefillFromUrl() {
  const p = new URLSearchParams(location.search);
  const r = parseInt(p.get('rooms'), 10);
  const b = parseInt(p.get('baths'), 10);
  if (r >= 1 && r <= 9) state.rooms = r;
  if (b >= 1 && b <= 9) state.baths = b;
})();

const phoneOk = () => state.phone.replace(/\D/g, '').length >= 7;
const fullPhone = () => state.dial + ' ' + state.phone.trim();
const isReno = () => state.type === 'renovation';

function basePrice() {
  if (isReno()) return state.area * RENO_RATE;
  let raw = 184.90 + (state.rooms - 1) * 45 + (state.baths - 1) * 40;
  if (state.kitchen === 'studio') raw -= 10;
  return state.type === 'house' ? raw * 1.2 : raw;
}

// орієнтовна тривалість прибирання: кімната ~30 хв, санвузол ~1 год.
// після ремонту — за площею (~12 м²/год). Мінімум прибирання — 3 години.
function durationHours() {
  const h = isReno() ? state.area / 12 : state.rooms * 0.5 + state.baths * 1;
  return Math.max(3, Math.round(h * 2) / 2);
}
function durationLabel() {
  const h = durationHours();
  const whole = Math.floor(h);
  const parts = [];
  if (whole > 0) parts.push(whole + ' ' + T.durHour);
  if (h - whole >= 0.5) parts.push(T.durMin);
  if (!parts.length) parts.push(T.durMin);
  return T.approx + ' ' + parts.join(' ');
}

function periodDisc() {
  if (isReno()) return 0; // після ремонту — разове
  return PERIODS.find((p) => p.id === state.period).disc;
}

function bathsWord(n) {
  return plural(n, T.bathsForms[0], T.bathsForms[1], T.bathsForms[2]);
}

// ---- побудова карток періодичності та опцій ----
const perGrid = $('perGrid');
PERIODS.forEach((p) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'period-card';
  btn.dataset.period = p.id;
  btn.innerHTML =
    (p.id === 'two' ? '<span class="period-pop">' + T.popular + '</span>' : '') +
    '<span class="period-badge" data-save hidden></span>' +
    '<span class="period-label">' + p.label + '</span>' +
    '<span class="period-price" data-price></span>';
  btn.addEventListener('click', () => { state.period = p.id; render(); });
  perGrid.appendChild(btn);
});

const exGrid = $('exGrid');
const WIN_MAX = 30;
EXTRAS.forEach((x) => {
  if (x.perUnit) {
    // миття вікон — рахуємо поштучно (лічильник з'являється після вибору)
    const card = document.createElement('div');
    card.className = 'extra-card window-card';
    card.dataset.extra = x.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML =
      (ICONS[x.id] || '') +
      '<span class="extra-label">' + x.label + '</span>' +
      '<span class="extra-price">' + x.price + ' zł / ' + x.unit + '</span>' +
      '<div class="mini-counter" hidden>' +
        '<button type="button" data-wdir="-1" aria-label="Менше вікон">−</button>' +
        '<span data-wval>0</span>' +
        '<button type="button" data-wdir="1" aria-label="Більше вікон">+</button>' +
      '</div>';
    const setQty = (q) => { state.extrasQty[x.id] = Math.max(0, Math.min(WIN_MAX, q)); render(); };
    card.addEventListener('click', (e) => {
      if (e.target.closest('.mini-counter')) return;
      setQty((state.extrasQty[x.id] || 0) > 0 ? 0 : 1);
    });
    card.querySelector('[data-wdir="1"]').addEventListener('click', () => setQty((state.extrasQty[x.id] || 0) + 1));
    card.querySelector('[data-wdir="-1"]').addEventListener('click', () => setQty((state.extrasQty[x.id] || 0) - 1));
    exGrid.appendChild(card);
  } else {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'extra-card';
    btn.dataset.extra = x.id;
    btn.innerHTML =
      (ICONS[x.id] || '') +
      '<span class="extra-label">' + x.label + '</span>' +
      '<span class="extra-price">' + x.price + ' zł</span>';
    btn.addEventListener('click', () => {
      state.extrasQty[x.id] = state.extrasQty[x.id] ? 0 : 1;
      render();
    });
    exGrid.appendChild(btn);
  }
});

// ---- обробники ----
document.querySelectorAll('.seg').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.type) state.type = btn.dataset.type;
    else if (btn.dataset.kitchen) state.kitchen = btn.dataset.kitchen;
    render();
  });
});

document.querySelectorAll('.step-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.step;
    const dir = Number(btn.dataset.dir);
    if (key === 'area') {
      state.area = Math.max(20, Math.min(400, state.area + dir * 5));
    } else {
      state[key] = Math.max(1, Math.min(9, state[key] + dir));
    }
    render();
  });
});

$('nameInput').addEventListener('input', (e) => {
  state.name = e.target.value;
  if (state.name.trim().length > 1) { e.target.classList.remove('invalid'); $('nameErr').hidden = true; }
  render();
});
$('phoneInput').addEventListener('input', (e) => {
  state.phone = e.target.value;
  if (phoneOk()) { e.target.classList.remove('invalid'); $('phoneErr').hidden = true; }
  render();
});
$('dialSelect').addEventListener('change', (e) => { state.dial = e.target.value; render(); });
$('dateInput').addEventListener('input', (e) => {
  state.date = e.target.value;
  if (state.date) { e.target.classList.remove('invalid'); $('dateErr').hidden = true; }
  render();
});
$('timeSelect').addEventListener('change', (e) => { state.time = e.target.value; render(); });
$('commentInput').addEventListener('input', (e) => { state.comment = e.target.value; render(); });
$('consentInput').addEventListener('change', (e) => {
  state.consent = e.target.checked;
  if (state.consent) { $('consentWrap').classList.remove('invalid'); $('consentErr').hidden = true; }
  render();
});

// минулі дати недоступні
$('dateInput').min = new Date().toISOString().slice(0, 10);

// ---- промокод ----
$('promoBtn').addEventListener('click', () => {
  const code = $('promoInput').value.trim().toUpperCase();
  $('promoErr').hidden = true;
  $('promoOk').hidden = true;
  if (!code) return;
  const disc = (CONFIG.promoCodes || {})[code];
  if (disc) {
    state.promoCode = code;
    state.promoDisc = disc;
    $('promoOk').textContent = T.promoApplied.replace('{code}', code).replace('{n}', Math.round(disc * 100));
    $('promoOk').hidden = false;
  } else {
    state.promoCode = '';
    state.promoDisc = 0;
    $('promoErr').textContent = T.promoNotFound;
    $('promoErr').hidden = false;
  }
  render();
});

// кнопки завжди виглядають клікабельними; якщо даних бракує —
// клік не відправляє, а підсвічує червоним, що саме треба заповнити.
// Телефон обов'язковий лише для заявки «ми передзвонимо».
function markInvalid(needPhone) {
  const nameBad = state.name.trim().length <= 1;
  const dateBad = !state.date;
  const phoneBad = needPhone && !phoneOk();
  const consentBad = !state.consent;
  $('nameInput').classList.toggle('invalid', nameBad);
  $('nameErr').hidden = !nameBad;
  $('phoneInput').classList.toggle('invalid', phoneBad);
  $('phoneErr').hidden = !phoneBad;
  $('dateInput').classList.toggle('invalid', dateBad);
  $('dateErr').hidden = !dateBad;
  $('consentWrap').classList.toggle('invalid', consentBad);
  $('consentErr').hidden = !consentBad;
  if (nameBad) $('nameInput').focus();
  else if (phoneBad) $('phoneInput').focus();
  else if (dateBad) $('dateInput').focus();
  return nameBad || dateBad || phoneBad || consentBad;
}

document.querySelectorAll('.js-order-tg').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (e.currentTarget.dataset.ready !== 'true') {
      e.preventDefault();
      markInvalid(false);
    }
  });
});

// заявка «ми передзвонимо» — для тих, хто без месенджерів.
// Кнопок дві (у сводці й унизу форми) — спільний обробник.
const CB_LABEL = T.cbLabel;
document.querySelectorAll('.js-callback').forEach((btn) => {
  const errEl = $(btn.dataset.err);
  btn.addEventListener('click', () => {
    errEl.hidden = true;
    if (markInvalid(true)) return;

    if (!CONFIG.leadEndpoint) {
      errEl.textContent = T.leadUnavailable.replace('{phone}', CONFIG.phone);
      errEl.hidden = false;
      return;
    }

    document.querySelectorAll('.js-callback').forEach((b) => { b.disabled = true; });
    btn.textContent = T.leadSending;

    fetch(CONFIG.leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: state.name,
        phone: fullPhone(),
        date: state.date,
        time: TIMES[state.time],
        promo: state.promoCode,
        comment: state.comment,
        order: buildOrderLines().join('\n'),
      }),
    })
      .then((r) => { if (!r.ok) throw new Error(r.status); })
      .then(() => {
        document.querySelectorAll('.js-callback').forEach((b) => { b.hidden = true; });
        document.querySelectorAll('.js-lead-ok').forEach((o) => { o.hidden = false; });
      })
      .catch(() => {
        document.querySelectorAll('.js-callback').forEach((b) => { b.disabled = false; b.textContent = CB_LABEL; });
        errEl.textContent = T.leadFailed.replace('{phone}', CONFIG.phone);
        errEl.hidden = false;
      });
  });
});

// відмінювання: 1 кімната / 2 кімнати / 5 кімнат
function plural(n, one, few, many) {
  const t = n % 10, h = n % 100;
  if (t === 1 && h !== 11) return one;
  if (t >= 2 && t <= 4 && (h < 12 || h > 14)) return few;
  return many;
}
const dmy = (iso) => (iso ? iso.split('-').reverse().join('.') : '');

// текст замовлення (мовою сторінки) — людяне повідомлення для месенджера/заявки.
// Пише його клієнт від першої особи: привітання, деталі списком, контакти, ввічливе питання.
function buildOrderLines() {
  const base = basePrice();
  const disc = periodDisc();
  const per = PERIODS.find((p) => p.id === state.period);
  const extrasSum = EXTRAS.reduce((sum, x) => sum + (state.extrasQty[x.id] || 0) * x.price, 0);
  const total = (base - base * disc + extrasSum) * (1 - state.promoDisc);
  const extrasList = EXTRAS.filter((x) => state.extrasQty[x.id] > 0)
    .map((x) => x.label.toLowerCase() + (x.perUnit && state.extrasQty[x.id] > 1 ? ' ×' + state.extrasQty[x.id] : ''))
    .join(', ');

  const d = [];
  if (isReno()) {
    d.push('• ' + T.renovation + ', ' + T.areaWord + ' ' + state.area + ' ' + T.sqm);
  } else {
    d.push('• ' + T[state.type] + ': ' + state.rooms + ' ' + plural(state.rooms, T.roomsForms[0], T.roomsForms[1], T.roomsForms[2]) +
      ', ' + state.baths + ' ' + plural(state.baths, T.bathsForms[0], T.bathsForms[1], T.bathsForms[2]));
    d.push('• ' + T.kitchen + ': ' + (state.kitchen === 'studio' ? T.kitchenStudioShort : T.kitchenFullShort));
    d.push('• ' + T.period + ': ' + per.label.toLowerCase() + (disc ? ' (−' + disc * 100 + '%)' : ''));
  }
  if (extrasList) d.push('• ' + T.extras + ': ' + extrasList);
  if (state.date) d.push('• ' + T.date + ': ' + dmy(state.date) + (state.time !== 'any' ? ', ' + TIMES[state.time].toLowerCase() : ''));
  // тривалість НЕ додаємо в повідомлення (лишається лише у сводці на сторінці)
  if (state.promoCode) d.push('• ' + T.promo + ': ' + state.promoCode + ' (−' + Math.round(state.promoDisc * 100) + '%)');
  d.push('• ' + T.price + ': ' + fmt(total) + ' zł');

  const lines = [T.greeting, '', ...d];
  if (state.comment) lines.push('• ' + T.comment + ': ' + state.comment);
  lines.push('');
  if (state.name && state.phone) lines.push(T.contactName + ' ' + state.name + ', ' + T.contactNum + ' ' + fullPhone() + '.');
  else if (state.name) lines.push(T.contactName + ' ' + state.name + '.');
  else if (state.phone) lines.push(T.contactNumOnly + ' ' + fullPhone() + '.');
  lines.push(T.closing);
  return lines;
}

// ---- рендер ----
function render() {
  const base = basePrice();
  const disc = periodDisc();
  const per = PERIODS.find((p) => p.id === state.period);
  const extrasSum = EXTRAS.reduce((sum, x) => sum + (state.extrasQty[x.id] || 0) * x.price, 0);
  const discountVal = base * disc;
  const subtotal = base - discountVal + extrasSum;
  const promoVal = subtotal * state.promoDisc;
  const total = subtotal - promoVal;
  const canSend = state.name.trim().length > 1 && !!state.date && state.consent;

  // тип + тип кухні
  document.querySelectorAll('.seg').forEach((btn) => {
    if (btn.dataset.type) btn.classList.toggle('active', btn.dataset.type === state.type);
    else if (btn.dataset.kitchen) btn.classList.toggle('active', btn.dataset.kitchen === state.kitchen);
  });

  // лічильники: квартира/будинок — кімнати й санвузли, після ремонту — площа
  $('roomsRow').hidden = isReno();
  $('bathsRow').hidden = isReno();
  $('areaRow').hidden = !isReno();
  $('kitchenRow').hidden = isReno();
  $('periodCard').hidden = isReno();
  $('roomsVal').textContent = state.rooms;
  $('bathsVal').textContent = state.baths;
  $('areaVal').textContent = state.area;

  // періодичність
  perGrid.querySelectorAll('.period-card').forEach((btn) => {
    const p = PERIODS.find((x) => x.id === btn.dataset.period);
    btn.classList.toggle('active', state.period === p.id);
    btn.querySelector('[data-price]').textContent = fmt(base * (1 - p.disc)) + ' zł';
    const save = btn.querySelector('[data-save]');
    if (p.disc > 0) { save.hidden = false; save.textContent = T.save + ' ' + fmt(base * p.disc) + ' zł'; }
    else { save.hidden = true; }
  });

  // опції
  exGrid.querySelectorAll('.extra-card').forEach((el) => {
    const q = state.extrasQty[el.dataset.extra] || 0;
    el.classList.toggle('on', q > 0);
    const wv = el.querySelector('[data-wval]');
    if (wv) wv.textContent = q;
    const mc = el.querySelector('.mini-counter');
    if (mc) mc.hidden = q === 0;
  });

  // підсумок
  $('summaryText').textContent = isReno()
    ? T.renovation + ' · ' + state.area + ' ' + T.sqm + ' · ' + T.onceShort
    : T[state.type] + ' · ' + state.rooms + ' ' + T.roomsShort + ' · ' + state.baths + ' ' + bathsWord(state.baths) + ' · ' + per.label.toLowerCase();
  $('basePrice').textContent = fmt(base) + ' zł';

  $('extrasRow').hidden = extrasSum === 0;
  $('extrasSum').textContent = '+' + extrasSum.toFixed(0) + ' zł';

  $('discountRow').hidden = disc === 0;
  $('discountLabel').textContent = T.discount + ' −' + disc * 100 + '%';
  $('discountVal').textContent = '−' + fmt(discountVal) + ' zł';

  $('promoRow').hidden = state.promoDisc === 0;
  $('promoLabel').textContent = T.promo + ' ' + state.promoCode;
  $('promoVal').textContent = '−' + fmt(promoVal) + ' zł';

  $('totalVal').textContent = fmt(total) + ' zł';
  // "стара" ціна = без знижки за періодичність і без промокоду; показуємо вигоду
  const fullPrice = base + extrasSum;
  const savings = Math.round(fullPrice) - Math.round(total);
  $('oldTotal').hidden = savings < 1;
  $('oldTotal').textContent = fmt(fullPrice) + ' zł';
  $('saveRow').hidden = savings < 1;
  $('saveVal').textContent = '−' + savings + ' zł';
  $('durationText').textContent = durationLabel();
  $('durationRow').hidden = isReno();

  const msg = encodeURIComponent(buildOrderLines().join('\n'));
  const href = canSend ? 'https://t.me/' + CONFIG.telegram + '?text=' + msg : '#';
  document.querySelectorAll('.js-order-tg').forEach((btn) => {
    btn.dataset.ready = String(canSend);
    btn.href = href;
  });
}

render();
