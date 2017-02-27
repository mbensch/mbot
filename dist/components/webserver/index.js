'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (controller) {
    var webserver = (0, _express2.default)();

    webserver.use(_bodyParser2.default.json());
    webserver.use(_bodyParser2.default.urlencoded({ extended: true }));
    webserver.use(_express2.default.static('public'));

    webserver.listen(process.env.PORT || 3000, null, function () {
        (0, _debug2.default)('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);
    });

    (0, _each2.default)(routes, function (route) {
        return route(webserver, controller);
    });

    controller.webserver = webserver;

    return webserver;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _index = require('./routes/index');

var routes = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG = (0, _debug2.default)('Bot Webserver');