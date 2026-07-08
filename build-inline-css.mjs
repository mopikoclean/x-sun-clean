// Вшиває CSS прямо в <head> сторінок, щоб прибрати render-blocking CSS-запити.
// Джерело правди — файли css/*.css. Запускати перед деплоєм: `node build-inline-css.mjs`.
// Між маркерами <!--CSS:START--> ... <!--CSS:END--> кладеться <style> зі змістом
// потрібних CSS. Якщо маркерів ще нема — замінює блок <link rel=stylesheet ...css...>.
import { readFileSync, writeFileSync } from 'node:fs';

const V = process.argv[2] || Date.now(); // версія для коментаря (кеш-бастинг не потрібен — inline)
const PAGES = {
  'index.html':            ['fonts', 'styles', 'home'],
  'pl/index.html':         ['fonts', 'styles', 'home'],
  'zamovlennya.html':      ['fonts', 'styles'],
  'pl/zamovlennya.html':   ['fonts', 'styles'],
  'shcho-prybyraiemo.html':['fonts', 'styles'],
  'privacy.html':          ['fonts', 'styles'],
  'dyzajn-systema.html':   ['fonts', 'styles'],
};

const cssCache = {};
const css = (name) => (cssCache[name] ??= readFileSync(`css/${name}.css`, 'utf8').trim());

for (const [page, files] of Object.entries(PAGES)) {
  let html = readFileSync(page, 'utf8');
  const style = '<style>\n' + files.map(css).join('\n') + '\n</style>';
  const block = `<!--CSS:START v=${V}-->\n${style}\n<!--CSS:END-->`;

  if (html.includes('<!--CSS:START')) {
    html = html.replace(/<!--CSS:START[\s\S]*?<!--CSS:END-->/, block);
  } else {
    // Прибрати всі <link rel="stylesheet" ...css...> і поставити блок замість першого.
    const linkRe = /[ \t]*<link rel="stylesheet" href="[^"]*css\/[^"]*\.css[^"]*">\n?/g;
    let first = true;
    html = html.replace(linkRe, () => (first ? (first = false, block + '\n') : ''));
  }
  writeFileSync(page, html);
  console.log(`inlined ${page}: ${files.join('+')} (${(style.length / 1024).toFixed(1)} KiB)`);
}
