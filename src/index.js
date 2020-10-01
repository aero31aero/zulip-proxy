const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const zulip = require('./zulip');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const port = 3000;

const app_url = 'http://zulip.showell.zulipdev.org:9991';
const client_id = 'ZyWpMYjhNX0bG2IT480T1qWzGFuT1istg5brUcPz';
const client_secret =
    'hoP2lNAQPzAh39CjQd20mnWk9GBwFdNMD4zDuzkJZP0xZzllTenZBdWnVW7CDSpfnWcrQHDeAaCyL0Q91rCnGamns4bjOmmbT7h8xwyy8ommfYA6R9GkjBUADFqrhr5v';
const redirect_uri = 'http://localhost:3000/o/callback';

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
        console.log(`express: listening at http://localhost:${port}`);
    });
});

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(formidable());
