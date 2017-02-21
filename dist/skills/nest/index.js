'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nest = require('./nest.js');

var _nest2 = _interopRequireDefault(_nest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (controller, environment) {

    var nestClient = new _nest2.default(controller.storage, environment.teamId);

    controller.hears(['nest debug'], 'direct_message,direct_mention,mention', function (bot, message) {
        nestClient.getData().then(function () {
            bot.reply(message, 'Your Nest debug output has been posted to your bot console.');
        });
    });

    controller.hears(['nest get temp'], 'direct_message,direct_mention,mention', function (bot, message) {
        nestClient.getTemp().then(function (temp) {
            bot.reply(message, 'Currently it\'s ' + temp + '&deg;F.');
        });
    });

    controller.hears(['nest get target'], 'direct_message,direct_mention,mention', function (bot, message) {
        nestClient.getTargetTemp().then(function (temp, time) {
            bot.reply(message, 'Your Nest is currently set to ' + temp + '&deg;F. The target temperature will be reached in ' + time);
        });
    });
};