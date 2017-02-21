import superagent from 'superagent';
import { values } from 'lodash';
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
    structure = {};
    thermostat = {};

    constructor(storage, teamId) {
        _checkEnvironment();

        storage.teams.get(teamId, (err, data) => {
            if (!data) {
                this.getAccessToken()
                    .then((response) => {
                        this.accessToken = response.access_token;
                        storage.teams.save({ id: teamId, nestAccessToken: response.access_token });
                        this.hydrateData();
                    });
            } else {
                this.accessToken = data.nestAccessToken;
                this.hydrateData();
            }
        });
    }

    getInfo() {
        return (
            this.hydrateData()
                .then(() => {
                    return { thermostat: this.thermostat, structure: this.structure };
                })
        );
    };

    setMode(mode) {
        return (
            this.write(`devices/thermostats/${this.thermostat.device_id}`, { hvac_mode: mode })
                .then(() => {
                    this.thermostat = { ...this.thermostat, hvac_mode: mode }
                    return this.thermostat;
                })
        );
    }

    setTemp(temp) {
        return (
            this.write(`devices/thermostats/${this.thermostat.device_id}`, { target_temperature_f: temp })
                .then(() => {
                    this.thermostat = { ...this.thermostat, target_temperature_f: temp }
                    return this.thermostat;
                })
        );
    }

    setAway() {
        return (
            this.write(`structures/${this.structure.structure_id}`, { away: 'away' })
                .then(() => {
                    this.structure = { ...this.structure, away: 'away' };
                })
        );
    }

    setHome() {
        return (
            this.write(`structures/${this.structure.structure_id}`, { away: 'home' })
                .then((home) => {
                    this.structure = { ...this.structure, away: 'home' };
                })
        );
    }

    //=========================> HELPER
    hydrateData() {
        return this.read().then((data) => {
            this.structure = values(data.structures)[0];
            const thermostatId = values(this.structure.thermostats)[0];
            this.thermostat = data.devices.thermostats[thermostatId];
        });
    }

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
                throw new Error('Couldn\'t get access token from Nest. Please check you environment variables.');
            });
    }

    read(path = '') {
        return superagent
            .get(`${NEST_API_ROOT}/${path}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.accessToken}`)
            .then((result) => {
                return result.body;
            })
            .catch((error) => {
                console.log('Error getting data:', error);
                return false;
            });
    }

    write(path = '', data) {
        return superagent
            .put(`${NEST_API_ROOT}/${path}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.accessToken}`)
            .send(data)
            .then((result) => {
                return result.body;
            })
            .catch((error) => {
                console.log('Write error:', error);
            });
    }
}

export default Nest;