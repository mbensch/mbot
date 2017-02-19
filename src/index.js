import Bot from 'core/Bot';
import * as Middleware from 'middleware';
import * as Skills from 'skills';

const bot = new Bot(true);

bot.addMiddleware(Middleware);
bot.addSkills(Skills);

bot.run();
