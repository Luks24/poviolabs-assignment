const mongoose = require('mongoose');


var User = mongoose.model('User', {
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
    completed:{
      type: Boolean,
      default: false
    },
    count:{
      type: Number,
      default: 0
    }
  }]
});

module.exports = {User}
