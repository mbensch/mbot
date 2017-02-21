// Only for deployment on forge
require('dotenv').config();

console.log('environment', process.env);

import each from 'lodash/each';
import path from 'path';
import Botkit from 'botkit';
import RedisStorage from 'botkit-storage-redis';
import * as Skills from './skills/index.js';

const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const DEBUG = process.env.BOT_DEBUG || false;
const REDIS = process.env.BOT_REDIS || false;

// We need the bot token, otherwise we can exit right away;
if (!BOT_TOKEN) {
    throw new Error('You need to provide the SLACK_BOT_TOKEN environment variable.');
    exit(1);
}

//=====> Determine storage backend and set appropriate options;
const storageOptions = {};

if (REDIS) {
    if (!process.env.REDIS_URL) {
        throw new Error('You can\'t use the REDIS option without specifying the REDIS_URL environment variable.');
        exit(1);
    }

    storageOptions.storage = RedisStorage({ url: process.env.REDIS_URL });
} else {
    storageOptions.json_file_store = path.resolve(__dirname, '../.db');
}

//=====> Initialize controller
const controller = Botkit.slackbot({
    debug: DEBUG,
    ...storageOptions,
});

//=====> Environment
let environment = {};

//=====> Spawn bot
controller.spawn({
    token: BOT_TOKEN
}).startRTM((err, bot, payload) => {
    if (err) { throw new Error(err) }
    environment = payload;

    //=====> Add skills
    each(Skills, (skill, name) => {
        console.log(`==> Adding skill ${name} to bot`);
        skill(controller, environment);
    });
});

//=====> Add middleware
// each(Middleware, (middleware, name) => {
//     console.log(`==> Adding middleware ${name} to bot`);
//     middleware(this.controller);
// });