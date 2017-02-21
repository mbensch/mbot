import Nest from './nest.js';
const LISTEN = 'direct_message,direct_mention,mention';
const UNAUTHORIZED_USER = 'Sorry, but only Marcel is allowed to tinker with his Nest!';
const LOADING_MSG = 'One second I\'m working on that :sonic:';

export default (controller, environment) => {

    const nestClient = new Nest(controller.storage, environment.team.id);

    controller.hears(['nest info'], LISTEN, (bot, message) => {
        nestClient.getInfo().then((info) => {
            const { name } = info.stucture;
            const { ambient_temperature_f, target_temperature_f, hvac_state, hvac_mode } = info.thermostat;
            bot.reply(
                message,
                `The temperature in ${name} is ${ambient_temperature_f}\xB0F.\n
                 The AC is currently ${hvac_state} and Nest is in ${hvac_mode} mode with target temperature set to ${target_temperature_f}\xB0F.`
            );
        });
    });

    controller.hears(['nest temp (.*)'], LISTEN, (bot, message) => {
        if ( message.user === 'U3YUJUB3R') {
            const targetTemp = Number(message.match[1]);
            let problem = false;

            bot.reply(message, LOADING_MSG);

            if ( targetTemp > 85 || targetTemp < 60 ) {
                problem == true;
                bot.reply(message, 'The target temperature has to be between 60 and 85. Try again!');
            }

            if (!problem) {
                nestClient.setTemp(targetTemp).then((info) => {
                    const { hvac_mode, target_temperature_f, time_to_target } = info;
                    const emoticon = targetMode === 'cool' ? ':snowflake:' : ':fire:';
                    bot.reply(message, `${emoticon} Nest is now in ${hvac_mode} mode. The target temperature is set to ${target_temperature_f}\xB0F and will be reached in ${time_to_target} hours.`);
                });
            }
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest mode (.*)'], LISTEN, (bot, message) => {
        if ( message.user === 'U3YUJUB3R') {
            const targetMode = message.match[1];
            let problem = false;

            bot.reply(message, 'One second I\'m working on that');

            if (!(targetMode === 'cool' || targetMode === 'heat')) {
                problem == true;
                bot.reply(message, 'The target mode is invalid. Only *cool* and *heat* are supported.!');
            }


            if (!problem) {
                nestClient.setMode(targetMode).then((info) => {
                    const emoticon = targetMode === 'cool' ? ':snowflake:' : ':fire:';
                    bot.reply(message, `${emoticon} Nest is now in ${info.hvac_mode} mode. The target temperature is set to ${info.target_temperature_f}\xB0F and will be reached in ${info.time_to_target} hours.`);
                });
            }
        } else {
           bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest away'], LISTEN, (bot, message) => {
        if ( message.user === 'U3YUJUB3R') {
            nestClient.setAway().then((info) => {
                bot.reply(message, 'Your Nest is now in _Away_ mode.');
            })
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest home'], LISTEN, (bot, message) => {
        if ( message.user === 'U3YUJUB3R') {
            nestClient.setHome().then((info) => {
                bot.reply(message, 'Your Nest is now in _Home_ mode.');
            })
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest get target'], 'direct_message,direct_mention,mention', (bot, message) => {
        nestClient.getTargetTemp().then((temp, time) => {
            bot.reply(message, `Your Nest is currently set to ${temp}&deg;F. The target temperature will be reached in ${time}`);
        });
    });
};
