import Nest from './nest.js';
const LISTEN = 'direct_message,direct_mention,mention';
const UNAUTHORIZED_USER = 'https://cdn.meme.am/cache/instances/folder467/500x/75759467.jpg';
const LOADING_MSG = 'One second I\'m working on that :sonic:';

export default (controller, environment) => {

    const nestClient = new Nest(controller.storage, environment.team.id);

    controller.hears(['nest info'], LISTEN, (bot, message) => {
        nestClient.getInfo().then((info) => {
            const { name } = info.structure;
            const { ambient_temperature_f, humidity, target_temperature_f, hvac_state, hvac_mode } = info.thermostat;
            bot.reply(
                message,
                `The temperature in ${name} is ${ambient_temperature_f}\xB0F with a humidity of ${humidity}%\n` +
                `The AC is currently ${hvac_state} and Nest is in ${hvac_mode} mode with ` +
                `target temperature set to ${target_temperature_f}\xB0F.`
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
                nestClient.setTemp(targetTemp)
                    .then((info) => {
                        const { hvac_mode, target_temperature_f, time_to_target } = info;
                        bot.reply(message, `The target temperature is set to ${target_temperature_f}\xB0F and will be reached in ${time_to_target} hours.`);
                    })
                    .catch((error) => {
                        bot.reply(message, `Damn, something went wrong. Nest told me this: ${error}`);
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

            if (!(targetMode === 'cool' || targetMode === 'heat' || targetMode === 'eco')) {
                problem == true;
                bot.reply(message, 'The target mode is invalid. Only *cool*, *heat* and *eco* are supported.!');
            }


            if (!problem) {
                nestClient.setMode(targetMode).then((info) => {
                    let emoticon = '';

                    switch (targetMode) {
                        case 'cool': emoticon = ':snowflake:'; break;
                        case 'heat': emoticon = ':fire:'; break;
                        case 'eco': emoticon = ':nest-eco:'; break;
                    }

                    bot.reply(message, `${emoticon} Nest is now in ${info.hvac_mode} mode.`);
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

    controller.hears(['test denied'], LISTEN, (bot, message) => {
       bot.reply(message, 'https://cdn.meme.am/cache/instances/folder467/500x/75759467.jpg' );
    });

};
