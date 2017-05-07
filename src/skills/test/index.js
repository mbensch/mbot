export default (controller) => {
    controller.hears(['test'], 'direct_message,direct_mention,mention', (bot, message) => {
        console.log('Received message', message);
        bot.reply(message, "Test success.");
    });
};
