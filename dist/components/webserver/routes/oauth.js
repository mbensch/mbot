'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (webserver, controller) {

    var handler = new OAUthHandler(controller);
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

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOG = (0, _debug2.default)('OAuth');

var OAUthHandler = function () {
    function OAUthHandler(controller) {
        _classCallCheck(this, OAUthHandler);

        this.controller = null;

        this.controller = controller;
    }

    _createClass(OAUthHandler, [{
        key: 'login',
        value: function login(request, response) {
            response.redirect(this.controller.getAuthorizeURL());
        }
    }, {
        key: 'oauth',
        value: function oauth(request, response) {
            var _this = this;

            var code = request.query.code;
            var state = reques.query.state;

            var slackApi = this.controller.spawn({});

            var options = {
                client_id: this.controller.config.client_id,
                client_secret: this.controller.config.client_secret,
                code: code
            };

            slackApi.api.oauth.access(options, function (err, auth) {
                if (err) {
                    LOG('Error confirming oauth', err);
                    return response.redirect('/login_error.html');
                }

                var scopes = auth.scope.split(/\,/);

                slackApi.api.auth.test({ token: auth.access_token }, function (err, identity) {

                    if (err) {
                        LOG('Error retrieving user identity', err);
                        return response.redirect('/login_error.html');
                    }

                    auth.identity = identity;
                    _this.controller.trigger('oauth:success', [auth]);

                    response.cookie('team_id', auth.team_id);
                    response.cookie('bot_user_id', auth.bot.bot_user_id);
                    response.redirect('/login_success.html');
                });
            });
        }
    }]);

    return OAUthHandler;
}();