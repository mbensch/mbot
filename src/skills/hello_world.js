export default (controller) => {
    controller.hears(['hello'], ['direct_message','direct_mention'], (bot, message) => {
        bot.reply("Hello World!");
    });
};
