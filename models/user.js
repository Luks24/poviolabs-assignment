const mongoose = require('mongoose'),
      jwt = require("jsonwebtoken"),
      _ = require('lodash'),
      bcrypt = require('bcryptjs');



const UserSchema = new  mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    
  },
  password: {
    type: String,
    require: true,
    minlength: 4
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  likes: [{
    user_id:{
      type: String,
      required: true
    },
    count:{
      type: Number,
      default: 0
    }
  }]
});



//returning specific data
UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'username', "password","tokens", "likes"]);
};

//method to generate token
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};


//method to find user by token
UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};
//find A user with username and password
UserSchema.statics.findByCredentials = function (username, password) {
  var User = this;

  return User.findOne({username}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//to hash and salt the pasword before saving
UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};

