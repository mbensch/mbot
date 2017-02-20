export default (controller) => {
    console.log('Adding skill', controller);

    controller.hears(['hello'], ['direct_message','direct_mention'], (bot, message) => {
        console.log('Received message', message);
        bot.reply(message, "Hello World!");
    });
};
