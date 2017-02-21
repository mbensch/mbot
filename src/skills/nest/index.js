import Nest from './nest.js';

export default (controller, environment) => {

    const nestClient = new Nest(controller.storage, environment.teamId);

    controller.hears(['nest debug'], 'direct_message,direct_mention,mention', (bot, message) => {
        nestClient.getData().then(() => {
            bot.reply(message, 'Your Nest debug output has been posted to your bot console.');
        });
    });

    controller.hears(['nest get temp'], 'direct_message,direct_mention,mention', (bot, message) => {
        nestClient.getTemp().then((temp) => {
            bot.reply(message, `Currently it\'s ${temp}&deg;F.`);
        });
    });

    controller.hears(['nest get target'], 'direct_message,direct_mention,mention', (bot, message) => {
        nestClient.getTargetTemp().then((temp, time) => {
            bot.reply(message, `Your Nest is currently set to ${temp}&deg;F. The target temperature will be reached in ${time}`);
        });
    });
};
