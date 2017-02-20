export default (controller) => {
    controller.hears(['hello'], ['direct_message','direct_mention'], (bot, message) => {
        console.info('Received message', message);
        bot.reply(message, "Hello World!");
    });
};
