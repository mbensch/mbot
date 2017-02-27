// Only for deployment on forge
require('dotenv').config();

console.log('environment', process.env);

import each from 'lodash/each';
import path from 'path';
import Botkit from 'botkit';
import RedisStorage from 'botkit-storage-redis';
import * as Skills from './skills/index.js';
import * as Components from './components/index';

const CLIENT_ID = process.env.SLACK_CLIENT_ID;
const CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const API_URL = process.env.SLACK_API_URL || 'https://slack.com';
const DEBUG = process.env.BOT_DEBUG || false;
const REDIS = process.env.BOT_REDIS || false;

// Set globals for testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// We need the bot token, otherwise we can exit right away;
if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('You need to provide the SLACK_CLIENT_ID and SLACK_CLIENT_SECRET environment variable.');
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
    storageOptions.json_file_store = path.resolve(__dirname, '../.db/');
}

//=====> Initialize controller
const controller = Botkit.slackbot({
    debug: DEBUG,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    ...storageOptions,
    api_root: process.env.API_URL,
});

controller.startTicking();

//=====> Add Components
each(Components, (component, name) => {
    console.log(`==> Adding component ${name}`);
    component(controller);
});

//=====> Add middleware
// each(Middleware, (middleware, name) => {
//     console.log(`==> Adding middleware ${name} to bot`);
//     middleware(this.controller);
// });

//=====> Add Skills
each(Skills, (skill, name) => {
    console.log(`==> Adding skill ${name}`);
    skill(controller, environment);
});