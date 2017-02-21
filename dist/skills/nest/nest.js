'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NEST_API_ROOT = 'https://developer-api.nest.com';
var NEST_AUTH_ROOT = 'https://api.home.nest.com/oauth2/access_token';

var _checkEnvironment = function _checkEnvironment() {
    if (!process.env.NEST_PIN) {
        throw new Error('You need to provide the NEST_PIN environment variable.');
        exit(1);
    }

    if (!process.env.NEST_PRODUCT_ID) {
        throw new Error('You need to provide the NEST_PRODUCT_ID environment variable.');
        exit(1);
    }

    if (!process.env.NEST_PRODUCT_SECRET) {
        throw new Error('You need to provide the NEST_PRODUCT_SECRET environment variable.');
        exit(1);
    }
};

var Nest = function () {
    function Nest(storage, teamId) {
        var _this = this;

        _classCallCheck(this, Nest);

        this.accessToken = null;
        this.tempScale = 'F';

        _checkEnvironment();

        storage.teams.get(teamId, function (err, data) {
            // If we don't have any data for that team we need to fetch the access token and store it
            if (err) {
                _this.getAccessToken().then(function (token) {
                    _this.accessToken = true;
                    storage.teams.save({ id: teamId, nestAccessToken: token });
                });
            } else {
                _this.accessToken = data.nestAccessToken;
            }
        });
    }

    _createClass(Nest, [{
        key: 'getTemp',
        value: function getTemp() {
            return this.getData().then(function (data) {
                // Read temp
            });
        }
    }, {
        key: 'getTargetTemp',
        value: function getTargetTemp() {
            return this.getData().then(function (data) {
                // Read temp and return it.
            });
        }
    }, {
        key: 'getAccessToken',
        value: function getAccessToken() {
            return _superagent2.default.post(NEST_AUTH_ROOT).type('form').send({ code: process.env.NEST_PIN }).send({ client_id: process.env.NEST_PRODUCT_ID }).send({ client_secret: process.env.NEST_PRODUCT_SECRET }).send({ grant_type: 'authorization_code' }).then(function (result) {
                return result.body;
            }).catch(function (error) {
                var type = error.body.error;
                var text = error.body.error_description;
                throw new Error('Couldn\'t get access token from Nest. Please check you environment variables. Error: ' + type + ': ' + text);
            });
        }
    }, {
        key: 'getData',
        value: function getData() {
            return _superagent2.default.get('' + NEST_API_ROOT).set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + this.accessToken).then(function (result) {
                console.log('Received Data:', result.body);
                return result.body;
            });
        }
    }]);

    return Nest;
}();

exports.default = Nest;