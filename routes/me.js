const express = require("express"),
      bodyParser = require("body-parser"),
      _ = require('lodash'),
      bcrypt = require('bcryptjs');
      
const{User} = require("../models/user");
const {authenticate} = require('../middleware/authenticate');

const router  = express.Router();


//GET route for getting current user
router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});


//PATCH route for updating password
router.patch("/me/update-password", authenticate, (req, res) =>{

    let newPassword = _.pick(req.body, 'password');
    const newP = newPassword.password;
     
       let hash = bcrypt.hashSync(newP, 10);

    User.findByIdAndUpdate(req.user.id, { $set: { password:hash }},  function (err, user){
  if (err) {
      res.send(err)
  }else{
      res.send("password updated")
  }
  
});
        

});



module.exports = router;