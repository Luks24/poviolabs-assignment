const express = require("express"),
      bodyParser = require("body-parser");

const{User} = require("../models/user");


const router  = express.Router();




//Most-liked route
router.get("/most-liked", (req, res) =>{
    User.find().then((user) => {
         const mostLikedArr = user.map(el => {
           let newObj = {
             username: el.username,
             likes: el.likes.reduce(function(prev, cur) {
                                       return prev + cur.count;
                                    }, 0)
           }
           return newObj;
         });
         
          mostLikedArr.sort(function (a, b) {
            return b.likes - a.likes;
          });
       res.send({mostLikedArr});
  }, (e) => {
    res.status(400).send(e);
  });
})

module.exports = router;