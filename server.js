const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('./mongoose');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;

let app = express();

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/users', (req, res) => {
    let user = new User({
        username: "Ollie",
        userId: 1
    });

    user.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.send(err);
    });
});

app.listen(port, () => {
    console.log(`App up on port ${port}`)
});
