//omogočim povezavo z podatkovno bazo in omogočim promises

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/povio7");

module.exports = {mongoose};