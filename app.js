//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const encrypt=require("mongoose-encryption");
app.set('view engine', 'ejs');
app.use(express.static("public"));

console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({
  extended: true
}));


//mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});
/////////////MongoDB Connection//////////////
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true});

///userSchema
// const userSchema={
//   email:String,
//   password:String
// };
//////////mongoose schema/////////
///userSchema
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret=process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields: ['password']});


/////user Model ///////////////
const User=new mongoose.model("User",userSchema);


///////////////home route /////////////////////
app.get("/",function(req,res){
  res.render("home");
});
///////////////login route /////////////////////
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
if(foundUser){
  if(foundUser.password===password){
    res.render("secrets");
  }else{
    res.render("login");
    console.log("password does not match , try agian!");
  }
   }
    }
  });
});
///////////////register route /////////////////////
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
//create new user
const newUser=new User({
  email:req.body.username,
  password:req.body.password
});
newUser.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets");
    console.log("registered Successfuly");
  }
});
});

app.listen(3000,function(){
  console.log("Server has Started on port 3000");
});
