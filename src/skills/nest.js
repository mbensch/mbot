import Nest from 'core/nest';

const nestClient = new Nest();

nestClient.getAccessToken();

export default (controller) => {
    controller.hears(['hello'], 'direct_message,direct_mention,mention', (bot, message) => {
        console.log('Received message', message);
        bot.reply(message, "Hello World!");
    });
};
