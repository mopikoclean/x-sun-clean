/* ===== «Що входить у прибирання» — інтерактивні кімнати =====
   Кожна кімната: зображення + хотспоти (координати у % від картинки).
   Хотспоти двох типів: included (входить у базову ціну) та extra
   (додаткова опція з ціною — веде на сторінку замовлення). */

const ROOMS = [
  {
    id: 'kitchen',
    label: 'Кухня',
    img: 'img/room-kitchen.webp',
    w: 1248, h: 909,
    alt: 'Ізометрична кухня: що ми прибираємо',
    spots: [
      { x: 44, y: 42, text: 'Миємо плиту та кухонний фартух' },
      { x: 63, y: 48, text: 'Миємо мийку та змішувач до блиску' },
      { x: 54, y: 55, text: 'Протираємо робочі поверхні та фасади шаф' },
      { x: 49, y: 25, text: 'Протираємо пил на полицях і посуді' },
      { x: 20, y: 51, text: 'Миємо підвіконня та радіатор' },
      { x: 44, y: 60, text: 'Протираємо стіл та стільці' },
      { x: 66, y: 79, text: 'Пилососимо й миємо підлогу, виносимо сміття' },
      { x: 43, y: 49, text: 'Духовка всередині', extra: '+40 zł' },
      { x: 80, y: 50, text: 'Холодильник всередині', extra: '+40 zł' },
      { x: 17, y: 32, text: 'Миття вікон', extra: '+40 zł' },
    ],
  },
  {
    id: 'bedroom',
    label: 'Кімната',
    img: 'img/room-bedroom.webp',
    w: 1248, h: 832,
    alt: 'Ізометрична спальня: що ми прибираємо',
    spots: [
      { x: 40, y: 55, text: 'Заправляємо ліжко, за потреби міняємо білизну' },
      { x: 19, y: 60, text: 'Витираємо пил з усіх відкритих поверхонь' },
      { x: 83, y: 40, text: 'Полірумо дзеркала' },
      { x: 30, y: 33, text: 'Протираємо рами, світильники та вимикачі' },
      { x: 48, y: 78, text: 'Пилососимо килим і миємо підлогу' },
      { x: 62, y: 30, text: 'Лад у шафі', extra: '+30 zł' },
      { x: 70, y: 38, text: 'Прасування', extra: '+45 zł' },
    ],
  },
  {
    id: 'bathroom',
    label: 'Санвузол',
    img: 'img/room-bathroom.webp',
    w: 1248, h: 832,
    alt: 'Ізометричний санвузол: що ми прибираємо',
    spots: [
      { x: 52, y: 62, text: 'Миємо та дезінфікуємо ванну і душ' },
      { x: 77, y: 66, text: 'Миємо та дезінфікуємо унітаз' },
      { x: 25, y: 54, text: 'Миємо раковини та змішувачі' },
      { x: 22, y: 36, text: 'Полірумо дзеркала' },
      { x: 52, y: 42, text: 'Протираємо полиці та засоби' },
      { x: 69, y: 42, text: 'Акуратно розвішуємо рушники' },
      { x: 52, y: 81, text: 'Миємо підлогу та килимок' },
    ],
  },
  {
    id: 'hallway',
    label: 'Коридор',
    img: 'img/room-hallway.webp',
    w: 1248, h: 832,
    alt: 'Ізометричний коридор: що ми прибираємо',
    spots: [
      { x: 34, y: 64, text: 'Охайно розставляємо взуття' },
      { x: 35, y: 38, text: 'Полірумо дзеркало' },
      { x: 51, y: 33, text: 'Витираємо пил з полиць і вішалок' },
      { x: 71, y: 48, text: 'Миємо вхідні двері та ручки' },
      { x: 51, y: 81, text: 'Пилососимо килимок і миємо підлогу' },
    ],
  },
];

const stage = document.getElementById('whatStage');
const listEl = document.getElementById('whatList');
const tabsEl = document.getElementById('whatTabs');

if (stage && listEl && tabsEl) initWhat();

function initWhat() {
let activeRoom = ROOMS[0];
let openSpot = null; // відкритий тултип (для тач-пристроїв)

// ---- вкладки кімнат ----
ROOMS.forEach((room, i) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'seg' + (i === 0 ? ' active' : '');
  btn.textContent = room.label;
  btn.addEventListener('click', () => {
    if (activeRoom === room) return;
    activeRoom = room;
    tabsEl.querySelectorAll('.seg').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderRoom(true);
  });
  tabsEl.appendChild(btn);
});

function closeTooltips() {
  openSpot = null;
  stage.querySelectorAll('.what-spot.open').forEach((s) => s.classList.remove('open'));
}

function linkHover(idx, on) {
  const spot = stage.querySelector('[data-spot="' + idx + '"]');
  const item = listEl.querySelector('[data-item="' + idx + '"]');
  if (spot) spot.classList.toggle('hl', on);
  if (item) item.classList.toggle('hl', on);
}

function renderRoom(animate) {
  const room = activeRoom;
  closeTooltips();

  const build = () => {
    // сцена: зображення + хотспоти
    stage.innerHTML = '';
    const img = document.createElement('img');
    img.src = room.img;
    img.alt = room.alt;
    img.width = room.w;
    img.height = room.h;
    img.loading = 'lazy';
    img.decoding = 'async';
    stage.appendChild(img);

    room.spots.forEach((s, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'what-spot' + (s.extra ? ' extra' : '');
      b.dataset.spot = idx;
      b.style.left = s.x + '%';
      b.style.top = s.y + '%';
      b.setAttribute('aria-label', s.text + (s.extra ? ' (додаткова опція ' + s.extra + ')' : ''));
      b.innerHTML =
        '<span class="dot">' + (s.extra ? '+' : idx + 1) + '</span>' +
        '<span class="tip' + (s.x > 55 ? ' left' : '') + '">' + s.text +
        (s.extra ? ' <em>' + s.extra + ' · опція</em>' : '') + '</span>';
      b.addEventListener('mouseenter', () => linkHover(idx, true));
      b.addEventListener('mouseleave', () => linkHover(idx, false));
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = b.classList.contains('open');
        closeTooltips();
        if (!wasOpen) { b.classList.add('open'); openSpot = b; }
      });
      stage.appendChild(b);
    });

    // чек-лист праворуч
    listEl.innerHTML = '';
    const included = room.spots.filter((s) => !s.extra);

    included.forEach((s) => {
      const idx = room.spots.indexOf(s);
      const li = document.createElement('li');
      li.className = 'what-item';
      li.dataset.item = idx;
      li.innerHTML = '<span class="n">' + (idx + 1) + '</span><span>' + s.text + '</span>';
      li.addEventListener('mouseenter', () => linkHover(idx, true));
      li.addEventListener('mouseleave', () => linkHover(idx, false));
      listEl.appendChild(li);
    });

  };

  if (animate) {
    stage.classList.add('switching');
    listEl.classList.add('switching');
    setTimeout(() => {
      build();
      stage.classList.remove('switching');
      listEl.classList.remove('switching');
    }, 180);
  } else {
    build();
  }
}

// клік поза точками закриває тултипи (для тачу)
document.addEventListener('click', () => closeTooltips());

renderRoom(false);
}
