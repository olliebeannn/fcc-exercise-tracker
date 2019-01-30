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
            return res.send("No user with that userId found");
        } else {
            exercise.save().then((newExercise) => {
                return res.send(newExercise);
            }, (err) => {
                return res.status(400).send(err);
            });
        }
    });
});

// Get exercise log
app.get('/api/exercise/log', (req, res) => {
    let userId = req.query.userId;

    console.log("from:", req.query.from);
    console.log("to:", req.query.to);

    if (!ObjectId.isValid(userId)) {
        return res.status(400).send("Enter a valid userId to get a log back");
    }

    User.findOne({_id: new ObjectId(userId)}).then((user) => {
        if (!user) {
            return res.send("No user with that userId found");
        } else {
            // if (req.query.from) console.log(req.query.from);

            let query = {
                userId: user._id.toHexString()
            };

            if (req.query.from || req.query.to) {
                query.date = {};
            }

            if (req.query.from) {
                let fromDate = new Date(req.query.from);

                if (fromDate.toUTCString() === 'Invalid Date') {
                    return res.status(400).send({
                        error: "The start date you entered is not valid. Enter a date in the format yyyy-mm-dd"
                    });
                } else {
                    query.date["$gte"] = new Date(req.query.from);
                }
            }

            if (req.query.to) {
                let toDate = new Date(req.query.to);

                if (toDate.toUTCString() === 'Invalid Date') {
                    return res.status(400).send({
                        error: "The end date you entered is not valid. Enter a date in the format yyyy-mm-dd"
                    });
                } else {
                    query.date["$lte"] = new Date(req.query.to);
                }
            }

            console.log(query);

            // Old hardcoded query
            // {
            //     userId: user._id.toHexString(),
            //     date: {
            //         $gte: new Date('2019-01-18')
            //     }
            // }

            Exercise.find(query).then((exercises) => {
                if (!exercises) {
                    return res.send("This user has no exercises recorded.");
                } else {
                    return res.send(exercises);
                }
            }, (err) => {
                res.send(err);
            });
            // return res.send(user);
        }
    });
});

app.listen(port, () => {
    console.log(`App up on port ${port}`)
});
