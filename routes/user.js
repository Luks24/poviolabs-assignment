const express = require("express"),
      bodyParser = require("body-parser");


const {ObjectID} = require('mongodb');        
const{User} = require("../models/user");
const {authenticate} = require('../middleware/authenticate');

const router  = express.Router();


// GET route for specific user
router.get('/user/:id', (req, res) => {
   var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    
    const arr = user.likes;
    const Total = arr.reduce(function(prev, cur) {
  return prev + cur.count;
}, 0);
    
    
    const result = {
        user: user.username,
        numberOfLikes: Total
        
    }

    res.send({result});
  }).catch((e) => {
    res.status(400).send();
  });
});


// ADD like route
router.post("/user/:id/like", authenticate, (req, res) =>{
   const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    //function finding the user
    let find = user.likes.find(x => x.user_id === req.user.id);
    if(req.params.id === req.user.id){
      res.send("you cant like yourself")
    }else if(find === undefined){
      
      //creating new like
        let user_id = req.user._id;
        let count = 1;

            user.likes.push({user_id, count});
            user.save();
            
            res.send(user);
    }else{
      
      //liking existing user likes
      find.count = 1;
        user.save();
        res.send(user);
    }
  }).catch((e) => {
    res.status(400).send();
  });
});

//UN-like route
router.post("/user/:id/unlike", authenticate, (req, res) =>{
    const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  User.findById(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    //finding user
    let find = user.likes.find(x => x.user_id === req.user.id);
    //if there are no likes for authenticated user you cant unlike it
    if(find === undefined){
    
      res.send("you can/t unlike it if you didn like it");
    }
   // reset number of likes for authenticated user to 0 
        find.count = 0;
        user.save();
        res.send(user);
  }).catch((e) => {
    res.status(400).send();
  });
    
});

module.exports = router;