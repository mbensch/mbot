module.exports = function(controller) {

    controller.hears(['nest'], 'direct_message,direct_mention', function(bot, message) {
        // Show Nest status info
    });

    controller.hears(['nest get temp'],'direct_message,direct_mention,mention', function(bot, message) {
        // Get current Nest temperature
        bot.api.reactions.add({
            name: 'snowflake',
            channel: message.channel,
            timestamp: message.ts
        });

    });

    controller.hears(['nest set temp (.*)'],'direct_message,direct_mention,mention', function(bot, message) {
        // Set Nest temperature
        var newTemp = message.match[1];

        bot.api.reactions.add({
            name: 'snowflake',
            channel: message.channel,
            timestamp: message.ts
        });

    });

};