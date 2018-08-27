const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  username: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }],
  likes: [{
    user_id:userOneId,
    count: 1
  }]
}, {
  _id: userTwoId,
  username: 'jen@example.com',
  password: 'userTwoPass'
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = { users, populateUsers};