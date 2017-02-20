import Bot from 'core/bot';
import * as Skills from 'skills';

// => Run the bot
const bot = new Bot();
bot.addSkills(Skills);
bot.run();