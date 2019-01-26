const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

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

// Test route
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

// Test route
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

// Create new exercise if user id is valid
app.post('/api/exercise/add', (req, res) => {
    let body = _.pick(req.body, ['userId', 'description', 'duration']);

    // Check that objectId is valid; reject if not
    if (!ObjectId.isValid(body.userId)) {
        return res.status(400).send("ObjectId is invalid");
    }

    // Check if there's date; if so, add to new document to send
    if (req.body.date !== '') {
        body.date = req.body.date;
    } else {
        body.date = undefined;
    }

    let exercise = new Exercise(body);

    // console.log(exercise);

    User.findOne({_id: new ObjectId(req.body.userId)}).then((user) => {
        if (!user) {
            return res.send("No user with that username found");
        } else {
            exercise.save().then((newExercise) => {
                return res.send(newExercise);
            }, (err) => {
                return res.status(400).send(err);
            });
        }
    });
});

app.listen(port, () => {
    console.log(`App up on port ${port}`)
});
