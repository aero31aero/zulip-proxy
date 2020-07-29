const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const zulip = require('./zulip');
const app = express();
const port = 3000;

zulip().then((client) => {
    app.get('/', (req, res) => res.render('index.pug'));

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
