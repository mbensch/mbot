import Botkit from 'botkit';

class Bot {

    botToken = '';
    controller = {};
    bot = {};
    skills = [];
    middlewares = [];

    constructor(debug = false, version = '0.0.1') {

        if (!process.env.SLACK_BOT_TOKEN) {
            throw new Error('You need to provide the SLACK_BOT_TOKEN environment variable.');
        }

        this.controller = Botkit.slackbot({ debug });
        this.controller.setupWebserver();
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
        }).startRTM((err) => {
            if (err) { throw new Error(err) }
        });

        this.middlewares.forEach(middleware => middleware(this.controller));
        this.skills.forEach( skill => skill(this.controller));
    };
}

export default Bot;