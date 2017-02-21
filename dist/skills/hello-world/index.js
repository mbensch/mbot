'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (controller) {
    controller.hears(['hello'], 'direct_message,direct_mention,mention', function (bot, message) {
        console.log('Received message', message);
        bot.reply(message, "Hello World!");
    });
};