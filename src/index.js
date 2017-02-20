import Bot from 'core/bot';
import * as Skills from 'skills';

const bot = new Bot();

bot.addSkills(Skills);

bot.run();