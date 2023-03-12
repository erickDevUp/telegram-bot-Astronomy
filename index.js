const { default: axios } = require("axios");
const Parser = require("rss-parser");
let parser = new Parser();

const { Telegraf } = require("telegraf");

const { message } = require("telegraf/filters");

const bot = new Telegraf("6092909492:AAHBFwlrfjTDsG8dezYnWZM8P3psnZlli48");

const RSS_URL = `https://www.space.com/feeds/all`;

bot.start(async (ctx) => {
  const job = true;
  ctx.reply(
    "⭐Welcome  " +
      ctx.from.first_name +
      "\n\n🪐 Hi there! I can help you with that. Here is a brief description for a Telegram bot that shows you astronomy photos and news every day:\n\nThis bot offers a daily dose of astronomy by sending you a breathtaking photo of space along with some interesting news about the field. Each day, you will receive a new photo and news article to keep you informed and inspired. The bot is perfect for anyone interested in astronomy, space exploration and the wonders of the universe. Never miss out on the latest developments in astronomy again - let this bot keep you up to date and inspired every day!\n\n " +
      "commands : \n\n/pic: get the Astronomy Picture of the Day\n\n /news: get the most important news of the day "
  );
  do {
    setTimeout.call(await working(), 10000);
  } while (job);

  const working = async () => {
    await getNews(ctx);
    ctx.reply("pic of the day:\n\n" + (await getIMG()));
  };
});

bot.on(message("sticker"), (ctx) => ctx.reply("🪐"));

bot.hears(
  [
    "pic",
    "Pic",
    "pics",
    "Pics",
    "PIC",
    "PICS",
    "PHOTO",
    "Photo",
    "photo",
    "foto",
    "fotos",
    "Foto",
    "Fotos",
    "FOTO",
    "FOTOS",
  ],
  async (ctx) => ctx.reply(await getIMG())
);

bot.command("pic", async (ctx) => ctx.reply(await getIMG()));

bot.command("news", async (ctx) => {
  await getNews(ctx);
});

bot.hears(["news", "new", "News", "New", "NEW", "NEWS"], async (ctx) => {
  await getNews(ctx);
});

bot.telegram.setMyCommands([
  { command: "start", description: "open the menu" },
  { command: "pic", description: "get the Astronomy Picture of the Day" },

  { command: "news", description: "get the most important news of the day" },
]);
bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const getNews = async (ctx) => {
  ctx.reply("News of the day:");
  const feed = await parser.parseURL(RSS_URL);
  return feed.items.forEach((item) => {
    ctx.reply(
      "⭐" + item.title + ":\n\n🪐" + item.contentSnippet + "\n\n" + item.link
    );
  });
};

const getIMG = async () => {
  const res = await axios(
    "https://api.nasa.gov/planetary/apod?api_key=9RUHxYDMfs6EfNMRClemRebIdyG5D9Ylni6eHs2d"
  );

  return await `🌑🌒🌓🌔🌕🌖🌗🌘🌑 \n\ndate: ${res.data.date} ⏰\n\nname: ${res.data.title} 😁\n\nurl: 📎 ${res.data.url} 📎 \n\n🧠 ${res.data.explanation}🧠\n\n🪐⭐`;
};
