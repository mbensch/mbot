import Botkit from 'botkit';

class Bot {

    botToken = '';
    controller = {};
    bot = {};
    skills = [];
    middlewares = [];

    constructor(debug = false) {

        if (!process.env.SLACK_BOT_TOKEN) {
            throw new Error('You need to provide the SLACK_BOT_TOKEN environment variable.');
        }

        this.controller = Botkit.slackbot({ debug });
        this.botToken = process.env.SLACK_BOT_TOKEN;
    }

    addMiddleware = (...middleware) => {
        this.middlewares.concat(middleware);
    };

    addSkills = (...skills) => {
        this.skills.concat(skills);
    };

    run = () => {
        this.bot = this.controller.spawn({
            token: this.botToken
        }).startRTM();

        this.middlewares.forEach(middleware => middleware(this.controller));
        this.skills.forEach( skill => skill(this.controller));
    };
}

export default Bot;