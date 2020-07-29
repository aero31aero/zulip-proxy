const express = require('express');
const zulip = require('./zulip');
const app = express();
const port = 3000;

zulip().then((cleint) => {
    console.log(cleint);
});

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => res.render('index.pug'));

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);
