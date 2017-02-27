import express from 'express';
import bodyParser from 'body-parser';
import each from 'lodash/each';
import * as routes from './routes/index';

export default function(controller) {
    const webserver = express();

    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));
    webserver.use(express.static('dist/public'));

    console.log('__dirname', __dirname);

    webserver.listen(process.env.PORT || 3000, null, function() {
        console.log('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);
    });

    each(routes, route => route(webserver, controller));

    controller.webserver = webserver;

    return webserver;
}
