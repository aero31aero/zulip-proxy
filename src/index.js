const bodyParser = require('body-parser');
const express = require('express');
const FormData = require('form-data');
const http = require('http');
const process = require('process');
const sessionHandler = require('express-session');
const WebSocket = require('ws');
const client_events = require('./client_events');

const game = require('./game');
const zulip = require('./zulip');

let config;

try {
    config = require('../oauth_config');
} catch {
    console.info('\n\nERROR IN CONFIG\n');
    console.info('cp oauth_config.example.js oauth_config');
    console.info('vim oauth_config\n');
    process.exit();
}

const host = config.host;
const port = config.port;
const app_url = config.app_url;
const client_id = config.client_id;
const client_secret = config.client_secret;
const redirect_uri = config.redirect_uri;
const session_secret = config.session_secret;

const session_opts = {
    secret: session_secret,
    cookie: { maxAge: 604800, sameSite: 'strict' },
    resave: false,
    saveUninitialized: false,
};

function pretty(obj) {
    return JSON.stringify(obj, null, 4);
}

console.info(`config:\n ${pretty(config)}\n`);

const z = zulip.make({
    app_url: app_url,
});

async function start_session(session, token_resp) {
    session.access_token = token_resp.access_token;
    const me = await z.get_current_user(session);
    session.user_id = me.user_id;
    session.save();
}

async function single_page_app(res, session) {
    console.info(`User ${session.user_id} has connected`);

    const page_params = {};

    // Get full user info, in case things
    // like names have changed.
    const me = await z.get_current_user(session);

    page_params.me = me;
    page_params.app_url = app_url;
    page_params.ws_port = port;

    res.render('index.pug', {
        page_params: JSON.stringify(page_params),
    });
}

function build_endpoints(app) {
    app.get('/', (req, res) => {
        const session = req.session;

        if (!session || !session.access_token) {
            console.info('NEED TO AUTH FIRST!!!!!');
            // Is there a reason we don't just
            // directly redirect to Zulip?
            return res.redirect('o/authorize');
        }

        single_page_app(res, session);
    });

    app.get('/o/authorize', (req, res) => {
        const code_url = `${app_url}/${z.oauth_prefix}/authorize?approval_prompt=auto&response_type=code&client_id=${client_id}&scope=write&redirect_uri=${redirect_uri}`;
        res.redirect(code_url);
    });

    app.get('/o/callback', async (req, res) => {
        if (!req.query.code) {
            return res.send('SOMETHING WENT WRONG');
        }
        try {
            const form = new FormData();
            form.append('client_id', client_id);
            form.append('client_secret', client_secret);
            form.append('redirect_uri', redirect_uri);
            form.append('grant_type', 'authorization_code');
            form.append('code', req.query.code);
            const token_resp = await z.get_access_token(form);

            console.log(token_resp.data);

            await start_session(req.session, token_resp.data);

            // redirect to the home page
            res.redirect('/');
        } catch (e) {
            console.error('ERROR', e);
            return res.send({
                req: e.toJSON(),
                data: e.response.data,
            });
        }
    });

    app.get('/z/*', async (req, res) => {
        const url = req.path.slice(3);
        z.api_get(req, res, url);
    });

    app.post('/z/*', async (req, res) => {
        const url = req.path.slice(3);
        z.api_post(req, res, url);
    });

    app.get('/user_uploads/*', async (req, res) => {
        z.handle_user_uploads(req, res);
    });
}

const app = express();

const session_parser = sessionHandler(session_opts);

app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(session_parser);
build_endpoints(app);

const server = http.createServer(app);

const wss = new WebSocket.Server({
    clientTracking: false,
    noServer: true,
});

const clients = [];

server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    session_parser(request, {}, () => {
        const user_id = request.session.user_id;

        if (!user_id) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, function (ws) {
            const client = {
                ws: ws,
                user_id: user_id,
                session: request.session,
            };
            clients.push(client);

            console.log(`${user_id} connected via sockets`);

            ws.on('close', () => {
                // TODO: remove from list
                console.log('closed');
            });

            ws.on('message', (message) => {
                game.handle_message(clients, client, message);
            });
            client_events(z, client);
        });
    });
});

server.listen(port, () => {
    console.log(`TO START: visit ${host}:${port} in your browser`);
});
