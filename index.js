const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("NO BOT TOKEN");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("Bot started...");

// Ответ на любое сообщение
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "👇 Открыть Avail", {
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
