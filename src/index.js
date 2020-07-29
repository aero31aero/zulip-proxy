const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const zulip = require('./zulip');
const app = express();
const port = 3000;

zulip().then((client) => {
    app.get('/', (req, res) => res.render('index.pug'));

    app.post('/proxy/api/v1/*', async (req, res) => {
        const endpoint = req.path.replace('/proxy/api/v1', '');
        const data = req.fields;
        const result = await client.callEndpoint(endpoint, 'POST', data);
        console.log(`zulip: Calling ${endpoint}. Result: ${JSON.stringify(result)}`);
        res.json(result);
    });

    app.listen(port, () =>
        console.log(`Example app listening at http://localhost:${port}`)
    );
});

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(formidable());
