const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const zulip = require('./zulip');
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

zulip().then((client) => {
    app.get('/', (req, res) => res.render('index.pug'));

    app.get('/o/code', (req, res) => {
        const code_url = `${app_url}/o/authorize?response_type=code&client_id=${client_id}&scope=read&redirect_uri=${redirect_uri}`;
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
            res.send(token_req.data);
        } catch (e) {
            console.error('ERROR', e);
            return res.send({
                req: e.toJSON(),
                data: e.response.data,
            });
        }
    });

    app.all('/proxy/api/v1/*', async (req, res) => {
        const endpoint = req.path.replace('/proxy/api/v1', '');
        let data = req.fields;
        const method = req.method;
        if (method === 'GET' && req.query) {
            data = req.query;
        }
        const result = await client.callEndpoint(endpoint, method, data);
        console.log(`zulip: Calling ${method} ${endpoint} => ${result.result}`);
        res.json(result);
    });

    app.listen(port, () => {
        console.log(`zulip: Logged in as ${client.config.username}`);
        console.log(`oauth: visit ${host}:${port}/o/code in your browser`);
    });
});

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(formidable());
