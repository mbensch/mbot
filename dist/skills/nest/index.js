'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nest = require('./nest.js');

var _nest2 = _interopRequireDefault(_nest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LISTEN = 'direct_message,direct_mention,mention';
var UNAUTHORIZED_USER = 'https://cdn.meme.am/cache/instances/folder467/500x/75759467.jpg';
var LOADING_MSG = 'One second I\'m working on that :sonic:';

exports.default = function (controller, environment) {

    var nestClient = new _nest2.default(controller.storage, environment.team.id);

    controller.hears(['nest info'], LISTEN, function (bot, message) {
        nestClient.getInfo().then(function (info) {
            var name = info.structure.name;
            var _info$thermostat = info.thermostat,
                ambient_temperature_f = _info$thermostat.ambient_temperature_f,
                humidity = _info$thermostat.humidity,
                target_temperature_f = _info$thermostat.target_temperature_f,
                hvac_state = _info$thermostat.hvac_state,
                hvac_mode = _info$thermostat.hvac_mode;

            bot.reply(message, 'The temperature in ' + name + ' is ' + ambient_temperature_f + '\xB0F with a humidity of ' + humidity + '%\n' + ('The AC is currently ' + hvac_state + ' and Nest is in ' + hvac_mode + ' mode with ') + ('target temperature set to ' + target_temperature_f + '\xB0F.'));
        });
    });

    controller.hears(['nest temp (.*)'], LISTEN, function (bot, message) {
        if (message.user === 'U3YUJUB3R') {
            var targetTemp = Number(message.match[1]);
            var problem = false;

            bot.reply(message, LOADING_MSG);

            if (targetTemp > 85 || targetTemp < 60) {
                problem == true;
                bot.reply(message, 'The target temperature has to be between 60 and 85. Try again!');
            }

            if (!problem) {
                nestClient.setTemp(targetTemp).then(function (info) {
                    var hvac_mode = info.hvac_mode,
                        target_temperature_f = info.target_temperature_f,
                        time_to_target = info.time_to_target;

                    bot.reply(message, 'The target temperature is set to ' + target_temperature_f + '\xB0F and will be reached in ' + time_to_target + ' hours.');
                }).catch(function (error) {
                    bot.reply(message, 'Damn, something went wrong. Nest told me this: ' + error);
                });
            }
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest mode (.*)'], LISTEN, function (bot, message) {
        if (message.user === 'U3YUJUB3R') {
            var targetMode = message.match[1];
            var problem = false;

            bot.reply(message, 'One second I\'m working on that');

            if (!(targetMode === 'cool' || targetMode === 'heat' || targetMode === 'eco')) {
                problem == true;
                bot.reply(message, 'The target mode is invalid. Only *cool*, *heat* and *eco* are supported.!');
            }

            if (!problem) {
                nestClient.setMode(targetMode).then(function (info) {
                    var emoticon = '';

                    switch (targetMode) {
                        case 'cool':
                            emoticon = ':snowflake:';break;
                        case 'heat':
                            emoticon = ':fire:';break;
                        case 'eco':
                            emoticon = ':nest-eco:';break;
                    }

                    bot.reply(message, emoticon + ' Nest is now in ' + info.hvac_mode + ' mode.');
                });
            }
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest away'], LISTEN, function (bot, message) {
        if (message.user === 'U3YUJUB3R') {
            nestClient.setAway().then(function (info) {
                bot.reply(message, 'Your Nest is now in _Away_ mode.');
            });
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['nest home'], LISTEN, function (bot, message) {
        if (message.user === 'U3YUJUB3R') {
            nestClient.setHome().then(function (info) {
                bot.reply(message, 'Your Nest is now in _Home_ mode.');
            });
        } else {
            bot.reply(message, UNAUTHORIZED_USER);
        }
    });

    controller.hears(['test denied'], LISTEN, function (bot, message) {
        bot.reply(message, 'https://cdn.meme.am/cache/instances/folder467/500x/75759467.jpg');
    });
};