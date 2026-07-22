/* Контакти — замініть на реальні перед публікацією */
window.MOPIKO = {
  phone: '+48 452 255 364',
  telegram: 'mopiko_pl',
  whatsapp: '48452255364',
  email: 'xsunclen@gmail.com',
  /* Промокоди: код (великими літерами) → частка знижки на підсумок.
     Приберіть або замініть перед публікацією. */
  promoCodes: {
    START15: 0.15,
  },
  /* Ендпоінт для заявок «ми передзвонимо» (кнопка на сторінці замовлення).
     /api/lead — serverless-функція Vercel (api/lead.js), яка шле заявку
     менеджеру в Telegram. Потребує env-змінних TELEGRAM_BOT_TOKEN і
     TELEGRAM_CHAT_ID у налаштуваннях проєкту Vercel. */
  leadEndpoint: '/api/lead',
};
