const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Команда /start (необязательно, но ок)
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Нажми кнопку ниже 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Открыть Avail",
            web_app: {
              url: "https://avail.asia"
            }
          }
        ]
      ]
    }
  });
});

// Автоответ на любое сообщение (чтобы можно было просто написать боту)
bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, "Открыть Avail 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Открыть Avail",
            web_app: {
              url: "https://avail.asia"
            }
          }
        ]
      ]
    }
  });
});
