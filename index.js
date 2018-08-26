const express = require("express"),
      bodyParser = require("body-parser");
      
const {mongoose} = require("./db/mongoose");
const{User} = require("./models/user");

const app = express();

app.use(bodyParser.json());


//testing 
app.get("/", (req, res) => {
    res.send("Hello world");
})


app.listen( process.env.PORT, () =>{
    console.log("server started");
});

module.exports = {app}