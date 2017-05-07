'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (controller) {

    /* Handle event caused by a user logging in with oauth */
    controller.on('oauth:success', function (payload) {

        LOG('Got a successful login!', payload);

        if (!payload.identity.team_id) {
            LOG('Error: received an oauth response without a team id', payload);
        }

        controller.storage.teams.get(payload.identity.team_id, function (err, team) {

            if (err) {
                LOG('Error: could not load team from storage system:', payload.identity.team_id, err);
            }

            var new_team = false;

            if (!team) {
                team = {
                    id: payload.identity.team_id,
                    createdBy: payload.identity.user_id,
                    url: payload.identity.url,
                    name: payload.identity.team
                };

                new_team = true;
            }

            team.bot = {
                token: payload.bot.bot_access_token,
                user_id: payload.bot.bot_user_id,
                createdBy: payload.identity.user_id,
                app_token: payload.access_token
            };

            var testbot = controller.spawn(team.bot);

            testbot.api.auth.test({}, function (err, bot_auth) {
                if (err) {
                    LOG('Error: could not authenticate bot user', err);
                } else {
                    team.bot.name = bot_auth.user;

                    // add in info that is expected by Botkit
                    testbot.identity = bot_auth;
                    testbot.team_info = team;

                    // Replace this with your own database!

                    controller.storage.teams.save(team, function (err, id) {
                        if (err) {
                            LOG('Error: could not save team record:', err);
                        } else {
                            if (new_team) {
                                controller.trigger('create_team', [testbot, team]);
                            } else {
                                controller.trigger('update_team', [testbot, team]);
                            }
                        }
                    });
                }
            });
        });
    });

    controller.on('create_team', function (bot, team) {

        LOG('Team created:', team);

        // Trigger an event that will establish an RTM connection for this bot
        controller.trigger('rtm:start', [bot.config]);

        // Trigger an event that will cause this team to receive onboarding messages
        controller.trigger('onboard', [bot, team]);
    });

    controller.on('update_team', function (bot, team) {

        LOG('Team updated:', team);
        // Trigger an event that will establish an RTM connection for this bot
        controller.trigger('rtm:start', [bot]);
    });
};

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG = (0, _debug2.default)('User Registration');