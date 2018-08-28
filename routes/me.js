const express = require("express"),
      bodyParser = require("body-parser"),
      _ = require('lodash');
      
const {mongoose} = require("../db/mongoose");
const{User} = require("../models/user");
const {authenticate} = require('../middleware/authenticate');

const router  = express.Router();


//GET route for getting current user
router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});


//reset password

router.patch("/me/update-password", authenticate, (req, res) =>{
  
  let password = _.pick(req.body,  'password');
  /// have to hash the password
User.findByIdAndUpdate(req.user.id, password, { new: true }, (err, user) => {
 
  });
  
res.send("updated password")
}); 

module.exports = router;