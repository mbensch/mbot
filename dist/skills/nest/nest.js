'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _lodash = require('lodash');

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
        this.structure = {};
        this.thermostat = {};

        _checkEnvironment();

        storage.teams.get(teamId, function (err, data) {
            if (!data) {
                _this.getAccessToken().then(function (response) {
                    _this.accessToken = response.access_token;
                    storage.teams.save({ id: teamId, nestAccessToken: response.access_token });
                    _this.hydrateData();
                });
            } else {
                _this.accessToken = data.nestAccessToken;
                _this.hydrateData();
            }
        });
    }

    _createClass(Nest, [{
        key: 'getInfo',
        value: function getInfo() {
            var _this2 = this;

            return this.hydrateData().then(function () {
                return { thermostat: _this2.thermostat, structure: _this2.structure };
            });
        }
    }, {
        key: 'setMode',
        value: function setMode(mode) {
            var _this3 = this;

            return this.write('devices/thermostats/' + this.thermostat.device_id, { hvac_mode: mode }).then(function () {
                _this3.thermostat = _extends({}, _this3.thermostat, { hvac_mode: mode });
                return _this3.thermostat;
            });
        }
    }, {
        key: 'setTemp',
        value: function setTemp(temp) {
            var _this4 = this;

            return this.write('devices/thermostats/' + this.thermostat.device_id, { target_temperature_f: temp }).then(function () {
                _this4.thermostat = _extends({}, _this4.thermostat, { target_temperature_f: temp });
                return _this4.thermostat;
            });
        }
    }, {
        key: 'setAway',
        value: function setAway() {
            var _this5 = this;

            return this.write('structures/' + this.structure.structure_id, { away: 'away' }).then(function () {
                _this5.structure = _extends({}, _this5.structure, { away: 'away' });
            });
        }
    }, {
        key: 'setHome',
        value: function setHome() {
            var _this6 = this;

            return this.write('structures/' + this.structure.structure_id, { away: 'home' }).then(function (home) {
                _this6.structure = _extends({}, _this6.structure, { away: 'home' });
            });
        }

        //=========================> HELPER

    }, {
        key: 'hydrateData',
        value: function hydrateData() {
            var _this7 = this;

            this.read().then(function (data) {
                _this7.structure = (0, _lodash.values)(data.structures)[0];
                var thermostatId = (0, _lodash.values)(_this7.structure.thermostats)[0];
                _this7.thermostat = data.devices.thermostats[thermostatId];
            });
        }
    }, {
        key: 'getAccessToken',
        value: function getAccessToken() {
            return _superagent2.default.post(NEST_AUTH_ROOT).type('form').send({ code: process.env.NEST_PIN }).send({ client_id: process.env.NEST_PRODUCT_ID }).send({ client_secret: process.env.NEST_PRODUCT_SECRET }).send({ grant_type: 'authorization_code' }).then(function (result) {
                return result.body;
            }).catch(function (error) {
                throw new Error('Couldn\'t get access token from Nest. Please check you environment variables.');
            });
        }
    }, {
        key: 'read',
        value: function read() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            return _superagent2.default.get(NEST_API_ROOT + '/' + path).set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + this.accessToken).then(function (result) {
                return result.body;
            }).catch(function (error) {
                console.log('Error getting data:', error);
                return false;
            });
        }
    }, {
        key: 'write',
        value: function write() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var data = arguments[1];

            return _superagent2.default.put(NEST_API_ROOT + '/' + path).set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + this.accessToken).send(data).then(function (result) {
                return result.body;
            }).catch(function (error) {
                console.error('Write error:', error);
            });
        }
    }]);

    return Nest;
}();

exports.default = Nest;