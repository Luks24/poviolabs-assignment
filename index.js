const express = require("express"),
      bodyParser = require("body-parser"),
      _ = require('lodash'),
      bcrypt = require('bcryptjs');
      
      
const {ObjectID} = require('mongodb');     
const {mongoose} = require("./db/mongoose");
const{User} = require("./models/user");
const {authenticate} = require('./middleware/authenticate');

const authRoutes = require("./routes/auth"),
      meRoutes = require("./routes/me"),
      mostLikedRoutes = require("./routes/most-liked"),
      userhRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.use(meRoutes);
app.use(mostLikedRoutes);
app.use(userhRoutes);


app.listen(process.env.PORT, () => {
    console.log("server started");
});

module.exports = {app};