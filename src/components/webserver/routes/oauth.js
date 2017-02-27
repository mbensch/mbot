class OAuthHandler {

    controller = null;

    constructor(controller) {
        this.controller = controller;
    }

    login = (request, response) => {
        response.redirect(this.controller.getAuthorizeURL());
    };

    oauth = (request, response) => {

        console.log('Incoming Request', request);

        const code = request.query.code;

        const slackApi = this.controller.spawn({});

        const options = {
            client_id: this.controller.config.clientId,
            client_secret: this.controller.config.clientSecret,
            code,
        };

        slackApi.api.oauth.access(options, (err, auth) => {
            if (err) {
                console.log('Error confirming oauth', err);
                return response.redirect('/login_error.html');
            }

            slackApi.api.auth.test({ token: auth.access_token}, (err, identity) => {

                if (err) {
                    console.log('Error retrieving user identity', err);
                    return response.redirect('/login_error.html');
                }

                auth.identity = identity;
                this.controller.trigger('oauth:success', [auth]);

                response.cookie('team_id', auth.team_id);
                response.cookie('bot_user_id', auth.bot.bot_user_id);
                response.redirect('/login_success.html');
            });
        });
    };
}

export default function(webserver, controller) {

    const handler = new OAuthHandler(controller);
    // Create a /login link
    // This link will send user's off to Slack to authorize the app
    webserver.get('/login', handler.login);

    // Create a /oauth link
    // This is the link that receives the postback from Slack's oauth system
    // So in Slack's config, under oauth redirect urls,
    // your value should be https://<my custom domain or IP>/oauth
    webserver.get('/oauth', handler.oauth);

    return handler;
}
