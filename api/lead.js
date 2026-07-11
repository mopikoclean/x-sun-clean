/* Заявка «Надіслати заявку» (для тих, хто без месенджерів) → Telegram.
   Vercel serverless function: приймає JSON з форми замовлення (js/order.js)
   і надсилає повідомлення менеджеру через Telegram Bot API.
   Секрети зберігаються в env-змінних проєкту Vercel (НЕ в коді):
     TELEGRAM_BOT_TOKEN — токен бота від @BotFather
     TELEGRAM_CHAT_ID   — chat_id одержувача; можна кілька через кому
                          (напр. "123,456" — розробник + менеджер клієнта) */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method' });
  }

  // Захист від використання ендпоінта з чужих сайтів: браузер шле Origin для
  // POST. Origin має збігатися з хостом, на який прийшов запит, — тож перевірка
  // сама адаптується до будь-якого домену (vercel.app, майбутній власний домен).
  const origin = req.headers.origin || '';
  if (origin) {
    let originHost = '';
    try { originHost = new URL(origin).host; } catch { /* битий Origin → відмова */ }
    if (originHost !== req.headers.host) {
      return res.status(403).json({ ok: false, error: 'origin' });
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'not configured' });
  }

  // обрізаємо все до розумних меж — захист від сміттєвих payload'ів
  const b = req.body || {};
  const s = (v, max) => String(v == null ? '' : v).slice(0, max).trim();

  const name = s(b.name, 100);
  const phone = s(b.phone, 40);
  const source = s(b.source, 20);
  // 'telegram'/'whatsapp' — автозаявка при переході в месенджер (телефон там
  // необов'язковий: клієнт і так на зв'язку в месенджері)
  const isMessenger = source === 'telegram' || source === 'whatsapp';
  if (!name || (!isMessenger && !phone)) {
    return res.status(400).json({ ok: false, error: 'name and phone required' });
  }

  const date = s(b.date, 40);
  const time = s(b.time, 60);
  const promo = s(b.promo, 40);
  const comment = s(b.comment, 600);
  const order = s(b.order, 2000);

  const head = source === 'telegram'
    ? '📨 Замовлення з сайту — клієнт відкрив Telegram (може написати вам сам, це дубль для підстраховки)'
    : source === 'whatsapp'
      ? '📨 Замовлення з сайту — клієнт відкрив WhatsApp (може написати вам сам, це дубль для підстраховки)'
      : '🧹 Нова заявка з сайту — передзвонити';
  const lines = [head, ''];
  lines.push('👤 ' + name);
  if (phone) lines.push('📞 ' + phone);
  if (date || time) lines.push('📅 ' + [date, time].filter(Boolean).join(' · '));
  if (promo) lines.push('🎟 Промокод: ' + promo);
  if (comment) lines.push('💬 ' + comment);
  if (order) lines.push('', '— Деталі замовлення —', order);

  // кілька одержувачів через кому; заявка успішна, якщо дійшла хоч одному
  const ids = chatId.split(',').map((x) => x.trim()).filter(Boolean);
  const results = await Promise.all(ids.map((id) =>
    fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: id, text: lines.join('\n') }),
    }).then((r) => r.ok).catch(() => false)
  ));

  if (!results.some(Boolean)) {
    return res.status(502).json({ ok: false, error: 'telegram' });
  }
  return res.status(200).json({ ok: true });
}
