const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('./mongoose');
const {User} = require('./models/user');
const {Exercise} = require('./models/exercise');

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

app.post('/api/exercise/new-user', (req, res) => {
    if (req.body.username === '') {
        return res.send('You must enter a username to create a new user.');
    }

    User.findOne({username: req.body.username}).then((user) => {
        if (user) {
            return res.send(user);
        } else {
            let user = new User({
                username: req.body.username
            });

            user.save().then((newUser) => {
                res.send(newUser);
            }, (err) => {
                res.status(400).send(err);
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });

});

app.get('/api/exercise/add', (req, res) => {
    let exercise = new Exercise({
        userId: '1',
        description: 'running',
        duration: 30,
        date: new Date('2019-01-01')
    });

    exercise.save().then((newExercise) => {
        res.send(newExercise);
    });
});

app.listen(port, () => {
    console.log(`App up on port ${port}`)
});
