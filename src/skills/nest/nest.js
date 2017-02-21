import superagent from 'superagent';

const NEST_API_ROOT = 'https://developer-api.nest.com';
const NEST_AUTH_ROOT = 'https://api.home.nest.com/oauth2/access_token';

const _checkEnvironment = () => {
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

class Nest {

    accessToken = null;
    tempScale = 'F';

    constructor(storage, teamId) {
        _checkEnvironment();

        storage.teams.get(teamId, (err, data) => {
            // If we don't have any data for that team we need to fetch the access token and store it
            if (err) {
                this.getAccessToken()
                    .then((token) => {
                        this.accessToken = true;
                        storage.teams.save({ id: teamId, nestAccessToken: token });
                    });
            } else {
                this.accessToken = data.nestAccessToken;
            }
        });
    }

    getTemp() {
        return this.getData()
            .then((data) => {
               // Read temp
            });
    };

    getTargetTemp() {
        return this.getData()
            .then((data) => {
                // Read temp and return it.
            });
    };

    getAccessToken() {
        return superagent
            .post(NEST_AUTH_ROOT)
            .type('form')
            .send({ code: process.env.NEST_PIN})
            .send({ client_id: process.env.NEST_PRODUCT_ID })
            .send({ client_secret: process.env.NEST_PRODUCT_SECRET })
            .send({ grant_type: 'authorization_code' })
            .then((result) => {
                return result.body;
            })
            .catch((error) => {
                const type = error.body.error;
                const text = error.body.error_description;
                throw new Error(`Couldn\'t get access token from Nest. Please check you environment variables. Error: ${type}: ${text}`);
            });
    }

    getData() {
        return superagent
            .get(`${NEST_API_ROOT}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.accessToken}`)
            .then((result) => {
                console.log('Received Data:', result.body);
                return result.body;
            });
    };
}

export default Nest;