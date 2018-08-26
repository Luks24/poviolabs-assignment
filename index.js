const express = require("express"),
      bodyParser = require("body-parser"),
      _ = require('lodash');  
      
      
const {ObjectID} = require('mongodb');     
const {mongoose} = require("./db/mongoose");
const{User} = require("./models/user");
const {authenticate} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());


// POST route for signing up
app.post('/signup', (req, res) => {
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

//GET route for getting current user
app.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

//Post route for logging in

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['username', 'password']);

  User.findByCredentials(body.username, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// GET route for specific user
app.get('/user/:id', (req, res) => {
   var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen( process.env.PORT, () =>{
    console.log("server started");
});

module.exports = {app};