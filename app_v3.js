// -----------------------     Level 3 Authentication      ---------------------//
// -----------------------        Hashing Password         ---------------------//

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const md5 = require('md5');

const app = express();

// MONGO DB CONNECTION
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

require('dotenv').config();
const secret = process.env.SECRET;

const userSchema = mongoose.Schema({
    email : String,
    password : String
});

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    res.render("login", {alertMessage: ""});
})

app.get("/register", (req, res) => {
    res.render("register", {alertMessage: ""});
})

app.post("/login", (req, res) => {

    const {email, password} = req.body;

    User.findOne({email : email}, (err, foundUser) => {
        if(!err){
            
            if(foundUser) {                                     // User found
                
                if(foundUser.password === md5(password) ){
                    res.render("secrets");                      // Access allowed, login successfull.
                } else {
                    res.render("login", {alertMessage : "Incorrect password"});
                }
            } 
            else {
                console.log("User not found");
                res.render("login", {alertMessage : "Invalid email credentials. Try again?"});
            }
        } else{
            res.send("ERROR in login : " + err);
        }
    });
});

app.post("/register", (req, res) => {
    
    const {email, password} = req.body;

    User.findOne({email : email}, (err, foundUser) => {
        if(!err) {
            if(foundUser) {
                res.render("register", {alertMessage : "Email already registered."});
            } else {
                const newUser = new User({
                    email : email,
                    password : md5(password)
                });
            
                newUser.save(function(err){
                    if(!err){
                        res.render("login", {alertMessage: ""});
                    } else {
                        res.send("ERROR in Registering" + err);
                    }
                })
            }
        }
    });    
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});




