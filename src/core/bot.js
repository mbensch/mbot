import Botkit from 'botkit';
import each from 'lodash/each';

class Bot {

    botToken = '';
    controller = {};
    bot = {};
    skills = {};
    middlewares = [];

    constructor(debug = false, version = '0.0.1') {

        if (!process.env.SLACK_BOT_TOKEN) {
            throw new Error('You need to provide the SLACK_BOT_TOKEN environment variable.');
        }

        this.controller = Botkit.slackbot({ debug });
        this.botToken = process.env.SLACK_BOT_TOKEN;
    }

    addMiddleware = (middleware) => {
        this.middlewares.push(middleware);
    };

    addSkills = (skills) => {
        this.skills = { ...this.skills, ...skills };
    };

    run = () => {
        this.bot = this.controller.spawn({
            token: this.botToken
        }).startRTM((err) => {
            if (err) { throw new Error(err) }
        });

        each(this.skills, (skill, name) => {
           console.log(`==> Adding skill ${name} to bot`);
           skill(this.controller);
        });
    };
}

export default Bot;