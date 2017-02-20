import Bot from 'core/bot';
import * as Skills from 'skills';

const bot = new Bot(true);

bot.addSkills(Skills);

bot.run();
