'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (webserver, controller) {

    var handler = new OAuthHandler(controller);
    // Create a /login link
    // This link will send user's off to Slack to authorize the app
    webserver.get('/login', handler.login);

    // Create a /oauth link
    // This is the link that receives the postback from Slack's oauth system
    // So in Slack's config, under oauth redirect urls,
    // your value should be https://<my custom domain or IP>/oauth
    webserver.get('/oauth', handler.oauth);

    return handler;
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OAuthHandler = function OAuthHandler(controller) {
    var _this = this;

    _classCallCheck(this, OAuthHandler);

    this.controller = null;

    this.login = function (request, response) {
        response.redirect(_this.controller.getAuthorizeURL());
    };

    this.oauth = function (request, response) {

        console.log('Incoming Request', request);

        var code = request.query.code;

        var slackApi = _this.controller.spawn({});

        var options = {
            client_id: _this.controller.config.clientId,
            client_secret: _this.controller.config.clientSecret,
            code: code
        };

        slackApi.api.oauth.access(options, function (err, auth) {
            if (err) {
                console.log('Error confirming oauth', err);
                return response.redirect('/login_error.html');
            }

            slackApi.api.auth.test({ token: auth.access_token }, function (err, identity) {

                if (err) {
                    console.log('Error retrieving user identity', err);
                    return response.redirect('/login_error.html');
                }

                console.log('auth', auth);
                console.log('identity', identity);

                auth.identity = identity;
                _this.controller.trigger('oauth:success', [auth]);

                response.cookie('team_id', auth.team_id);
                response.cookie('bot_user_id', auth.bot.bot_user_id);
                response.redirect('/login_success.html');
            });
        });
    };

    this.controller = controller;
};