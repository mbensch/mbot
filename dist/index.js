'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _botkitStorageRedis = require('botkit-storage-redis');

var _botkitStorageRedis2 = _interopRequireDefault(_botkitStorageRedis);

var _index = require('./skills/index.js');

var Skills = _interopRequireWildcard(_index);

var _index2 = require('./components/index');

var Components = _interopRequireWildcard(_index2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Only for deployment on forge
require('dotenv').config();

console.log('environment', process.env);

var CLIENT_ID = process.env.SLACK_CLIENT_ID;
var CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
var API_URL = process.env.SLACK_API_URL || 'https://slack.com';
var DEBUG = process.env.BOT_DEBUG || false;
var REDIS = process.env.BOT_REDIS || false;

// Set globals for testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// We need the bot token, otherwise we can exit right away;
if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('You need to provide the SLACK_CLIENT_ID and SLACK_CLIENT_SECRET environment variable.');
    exit(1);
}

//=====> Determine storage backend and set appropriate options;
var storageOptions = {};

if (REDIS) {
    if (!process.env.REDIS_URL) {
        throw new Error('You can\'t use the REDIS option without specifying the REDIS_URL environment variable.');
        exit(1);
    }

    storageOptions.storage = (0, _botkitStorageRedis2.default)({ url: process.env.REDIS_URL });
} else {
    storageOptions.json_file_store = _path2.default.resolve(__dirname, '../.db/');
}

//=====> Initialize controller
var controller = _botkit2.default.slackbot(_extends({
    debug: DEBUG,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scopes: ['bot']
}, storageOptions, {
    api_root: process.env.API_URL
}));

controller.startTicking();

//=====> Add Components
(0, _each2.default)(Components, function (component, name) {
    console.log('==> Adding component ' + name);
    component(controller);
});

//=====> Add middleware
// each(Middleware, (middleware, name) => {
//     console.log(`==> Adding middleware ${name} to bot`);
//     middleware(this.controller);
// });

//=====> Add Skills
(0, _each2.default)(Skills, function (skill, name) {
    console.log('==> Adding skill ' + name);
    skill(controller);
});