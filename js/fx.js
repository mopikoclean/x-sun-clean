/* Магнітні кнопки: елемент плавно тягнеться до курсора.
   Зсув пишеться в CSS-змінні --mx/--my (а не в inline transform),
   щоб :active-стани могли комбінувати його зі своїм scale. */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  // магнітний ефект — це рух: під prefers-reduced-motion не вмикаємо
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.magnet').forEach((el) => {
    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let rect = null;

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.setProperty('--mx', cx.toFixed(2) + 'px');
      el.style.setProperty('--my', cy.toFixed(2) + 'px');
      if (Math.abs(tx - cx) > 0.15 || Math.abs(ty - cy) > 0.15) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
        if (tx === 0 && ty === 0) {
          el.style.removeProperty('--mx');
          el.style.removeProperty('--my');
        }
      }
    };
    const start = () => { if (raf === null) raf = requestAnimationFrame(tick); };

    el.addEventListener('mouseenter', () => {
      // базовий прямокутник фіксуємо на вході, поки кнопка ще не зміщена
      rect = el.getBoundingClientRect();
    });
    el.addEventListener('mousemove', (e) => {
      if (el.classList.contains('disabled')) return;
      if (!rect) rect = el.getBoundingClientRect();
      tx = (e.clientX - rect.left - rect.width / 2) * 0.07;
      ty = (e.clientY - rect.top - rect.height / 2) * 0.07;
      start();
    });
    el.addEventListener('mouseleave', () => {
      tx = 0; ty = 0; rect = null;
      start();
    });
  });
})();
