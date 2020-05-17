const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-don:test123@cluster0-jtkh3.mongodb.net/accountDB", {useNewUrlParser: true, useUnifiedTopology: true});

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

let reqStat

app.post("/login", function(req,res){
    let userDetails = {
        username: req.body.usrname,
        password: req.body.pass
    }
    console.log(userDetails.password, userDetails.username);
    
    Account.findOne({usrname: userDetails.username, password: userDetails.password}, function(err, result){
        
        try{
            if(!result){
                res.redirect("/failure");
            } else {
                console.log("Correct");
                res.redirect("/success-login");
            }
        }
        catch(err){
            alert("err");
        } 

    })
    .catch(function(err){
        console.log(err);
    })
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

let port = process.env.PORT;

if(port == null || port == ""){
    port = 3000;
}

app.listen(port, function(){
    console.log("Server started on port 3000.");
});