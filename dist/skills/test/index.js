'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (controller) {
    controller.hears(['test'], 'direct_message,direct_mention,mention', function (bot, message) {
        console.log('Received message', message);
        bot.reply(message, "Test success.");
    });

    controller.hears(['debug'], 'direct_message', function (bot, message) {
        console.log('Received message', message);
        bot.reply(message, JSON.stringify(message));
    });
};