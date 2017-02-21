import superagent from 'superagent';

const NEST_REST_ROOT = 'https://developer-api.nest.com';
const NEST_AUTH_ROOT = 'https://api.home.nest.com/oauth2/access_token';

class Nest {

    accessToken = null;

    constructor() {
        if (!process.env.NEST_PIN) {
            throw new Error('You need to provide the NEST_PIN environment variable.');
        }

        if (!process.env.NEST_PRODUCT_ID) {
            throw new Error('You need to provide the NEST_PRODUCT_ID environment variable.');
        }

        if (!process.env.NEST_PRODUCT_SECRET) {
            throw new Error('You need to provide the NEST_PRODUCT_SECRET environment variable.');
        }
    }

    getTemp() {

    }

    setTemp(temp) {

    }

    isAway() {

    }

    setAway() {

    }

    getMode() {

    }

    setMode() {

    }

    getAccessToken() {
        return superagent
            .post(NEST_AUTH_ROOT)
            .set('Content-Type', 'application/json')
            .send({
                code: process.env.NEST_PIN,
                client_id: process.env.NEST_PRODUCT_ID,
                client_secret: process.env.NEST_PRODUCT_SECRET,
                grant_type: 'authorization_code',
            })
            .then((result) => {
                console.log('Result from auth', result);
            })
            .catch((error) => {
                console.error('Error getting nest auth', error)
            })
    }
}

export default Nest;