const express = require("express"),
      bodyParser = require("body-parser"),
      _ = require('lodash');

const{User} = require("../models/user");


const router  = express.Router();


router.post('/signup', (req, res) => {
  let body = _.pick(req.body, ['username', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});



//POST route for logging in

router.post('/login', (req, res) => {
  const body = _.pick(req.body, ['username', 'password']);

  User.findByCredentials(body.username, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

module.exports = router;