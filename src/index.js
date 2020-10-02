const process = require('process');
const express = require('express');
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

async function single_page_app(res, get) {
    const me = await get('users/me');

    res.set('Content-Type', 'text/plain');
    res.send(`HELLO ${me.data.full_name}\n---\n\n` + pretty(me.data));
}

function oauth() {
    app.get('/', (req, res) => res.send('Use o/code for now'));

    app.get('/o/code', (req, res) => {
        const code_url = `${app_url}/o/authorize?approval_prompt=auto&response_type=code&client_id=${client_id}&scope=read&redirect_uri=${redirect_uri}`;
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

            const get = async (short_url) => {
                const data = await axios.get(
                    `${app_url}/api/v1/${short_url}`,
                    {headers: {Bearer: access_token},
                });
                return data;
            };

            single_page_app(res, get);

        } catch (e) {
            console.error('ERROR', e);
            return res.send({
                req: e.toJSON(),
                data: e.response.data,
            });
        }
    });

    app.listen(port, () => {
        console.log(`oauth: visit ${host}:${port}/o/code in your browser`);
    });
}


app.use(express.static('public'));
oauth();
