const process = require('process');
const express = require('express');
const qs = require('qs');
const axios = require('axios');
const FormData = require('form-data');
const app = express();

let oauth_config;

try {
    oauth_config = require('../oauth_config');
} catch {
    console.info("\n\nERROR IN CONFIG\n");
    console.info("cp oauth_config.example.js oauth_config");
    console.info("vim oauth_config\n");
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

/* Note that we only support a single session now--we eventually
   need to actually give session keys (or similar) to our clients,
   so we can tell them apart, without having to give them actual
   access tokens.
*/
let singleton_session = undefined;

function get_session() {
    // eventually we will expressjs/session or similar
    return singleton_session;
}

async function start_session(access_token) {
    const session = {};
    session.access_token = access_token;
    // use age for debugging purposes
    session.age = 0;
    singleton_session = session;

    const helper = get_helper(session);

    await helper.post("messages", {
        type: "stream",
        to: "all",
        topic: "hello",
        content: "/me just joined using the oauth client",
    });
}

function url(short_url) {
    return `${app_url}/api/v1/${short_url}`;
}

function get_helper(session) {
    const helper = {};
    const headers = {Bearer: session.access_token}

    helper.get = async (short_url) => {
        const resp = await axios.get(
            url(short_url),
            {headers: headers},
        );
        return resp.data;
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

    session.age += 1;
    const helper = get_helper(session);
    const get = helper.get;

    page_params.session_age = session.age; // this just lets us know reloads are doing real work
    page_params.messages = await get('messages?num_before=5&anchor=newest&num_after=0');
    page_params.users = await get('users');
    page_params.me = await get('users/me');

    res.set('Content-Type', 'text/plain');
    res.send(`HELLO ${page_params.me.full_name}\n---\n\n` + pretty(page_params));

    await helper.post("messages", {
        type: "stream",
        to: "all",
        topic: "hello",
        content: `/me has a session with age ${session.age}`,
    });
}

function oauth() {
    app.get('/', (req, res) => {
        const session = get_session();

        if (!session) {
            console.info("NEED TO AUTH FIRST!!!!!");
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
            const token_req = await axios.post(`${app_url}/o/token/`, form, {
                headers: form.getHeaders(),
            });

            const access_token = token_req.data.access_token;

            start_session(access_token);

            // redirect to the home page
            res.redirect("/");

        } catch (e) {
            console.error('ERROR', e);
            return res.send({
                req: e.toJSON(),
                data: e.response.data,
            });
        }
    });

    app.listen(port, () => {
        console.log(`TO START: visit ${host}:${port} in your browser`);
    });
}


app.use(express.static('public'));
oauth();
