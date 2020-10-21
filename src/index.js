const bodyParser = require('body-parser');
const process = require('process');
const express = require('express');
const qs = require('qs');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const session = require('express-session');
const game = require('./game');

// TODO: configure 3030
const game_port = 3030;
game.start_ws(game_port);

let oauth_config;

try {
    oauth_config = require('../oauth_config');
} catch {
    console.info('\n\nERROR IN CONFIG\n');
    console.info('cp oauth_config.example.js oauth_config');
    console.info('vim oauth_config\n');
    process.exit();
}

function pretty(obj) {
    return JSON.stringify(obj, null, 4);
}

console.info(`oauth_config:\n ${pretty(oauth_config)}\n`);

const host = oauth_config.host;
const port = oauth_config.port;
const app_url = oauth_config.app_url;
const client_id = oauth_config.client_id;
const client_secret = oauth_config.client_secret;
const redirect_uri = oauth_config.redirect_uri;
const session_secret = oauth_config.session_secret;

async function start_session(session, token_resp) {
    session.access_token = token_resp.access_token;
    session.save();
}

function url(short_url) {
    return `${app_url}/api/v1/${short_url}`;
}

function get_helper(session) {
    const helper = {};
    const headers = { Bearer: session.access_token };

    helper.get = async (short_url, data) => {
        const resp = await axios({
            method: 'get',
            url: url(short_url),
            params: data,
            headers: headers,
        });
        return resp.data;
    };

    helper.pipe = async (short_url, data, res) => {
        const resp = await axios({
            method: 'get',
            url: `${app_url}/${short_url}`,
            params: data,
            headers: headers,
            responseType: 'stream',
        });
        resp.data.pipe(res);
    };

    helper.post = async (short_url, data) => {
        const resp = await axios({
            method: 'post',
            url: url(short_url),
            data: qs.stringify(data),
            headers: headers,
        });
        return resp.data;
    };

    return helper;
}

async function single_page_app(res, session) {
    const page_params = {};

    const helper = get_helper(session);
    const get = helper.get;

    const me = await get('users/me');

    const game_user = {
        name: me.full_name,
        user_id: me.user_id,
    };

    session.game = game.get_info(session.game, game_user);
    page_params.me = me;
    page_params.app_url = app_url;
    page_params.game = session.game;
    page_params.game_port = game_port;

    res.render('index.pug', {
        page_params: JSON.stringify(page_params),
    });
}

function oauth() {
    app.get('/', (req, res) => {
        const session = req.session;

        if (!session || !session.access_token) {
            console.info('NEED TO AUTH FIRST!!!!!');
            return res.redirect('o/authorize');
        }

        single_page_app(res, session);
    });

    app.get('/o/authorize', (req, res) => {
        const code_url = `${app_url}/o/authorize?approval_prompt=auto&response_type=code&client_id=${client_id}&scope=write&redirect_uri=${redirect_uri}`;
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
            const token_resp = await axios.post(`${app_url}/o/token/`, form, {
                headers: form.getHeaders(),
            });

            console.log(token_resp.data);

            start_session(req.session, token_resp.data);

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

        const helper = get_helper(req.session);
        const get = helper.get;

        const result = await get(url, req.query);
        res.json(result);
    });

    app.get('/user_uploads/*', async (req, res) => {
        const helper = get_helper(req.session);
        const pipe = helper.pipe;
        const url = req.path;
        await pipe(url, req.query, res);
    });

    app.post('/z/*', async (req, res) => {
        const url = req.path.slice(3);

        const helper = get_helper(req.session);
        const post = helper.post;

        const result = await post(url, req.body);
        res.json(result);
    });

    app.listen(port, () => {
        console.log(`TO START: visit ${host}:${port} in your browser`);
    });
}

app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(
    session({
        secret: session_secret,
        cookie: { maxAge: 604800, sameSite: 'strict' },
        resave: false,
        saveUninitialized: false,
    })
);
oauth();
