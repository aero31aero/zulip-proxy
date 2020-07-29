const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const zulip = require('./zulip');
const app = express();
const port = 3000;

// zulip().then((client) => {
//     console.log(client);
// });

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());
app.use(formidable());

app.get('/', (req, res) => res.render('index.pug'));

app.post('/proxy/api/v1/*', (req, res) => {
    console.log(req.path, JSON.stringify(req.fields));
    res.json({
        status: 'Success',
    });
});

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);
