const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/accountDB", {useNewUrlParser: true, useUnifiedTopology: true});

const accountSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: {
        type: String,
        unique: true
    },
    usrname: {
        type: String,
        unique: true
    },
    password: String
});

const Account = new mongoose.model("Account", accountSchema);

app.get("/", function(req,res){
    res.sendFile( __dirname + "/landing.html");
});

app.get("/signup", function(req,res){
    res.sendFile( __dirname + "/signup.html");
});

app.post("/signup", function(req,res){

    let account = new Account({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.emailID,
        usrname: req.body.usrname,
        password: req.body.pass 
    });

    account.save();

    res.redirect("/success");
});

app.get("/login",function(req,res){
    res.sendFile( __dirname + "/login.html");
});

app.post("/login", function(req,res){
    let userDetails = {
        username: req.body.usrname,
        password: req.body.pass
    }
    let requestStatus = checkAccount(userDetails);
});

app.get("/success", function(req,res){
    res.sendFile( __dirname + "/success.html");
});

app.get("/success-login", function(req,res){
    res.sendFile(__dirname + "/login-success.html");
});

app.get("/failure", function(req,res){
    res.sendFile( __dirname + "/failure.html");
});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
});