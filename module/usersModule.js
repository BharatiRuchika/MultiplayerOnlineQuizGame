const usersData = require("../models/users");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
exports.addUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const schema = Joi.object({
      fname:Joi.string().min(4).max(15).required(),
      lname:Joi.string().min(4).max(15).required(),
      email:Joi.string().min(6).max(50).email().required(),
      password:Joi.string().min(8).required()
    })
    var {error} = await schema.validate(req.body);
    if(error){
      return res.status(400).send({msg:error.details[0].message})
    }
    var user = await usersData.find({ email: req.body.email });
    console.log("user", user);
    console.log("length", user.length);
  } catch (err) {
    cosole.log("err", err);
  }
  if (user.length != 0) {
    var errmsg = "user already exist"
    console.log("user alredy exits");
    return res.send(errmsg);
  }

  try {
    const salt = await bcrypt.genSalt();
    console.log("salt", salt);

    console.log("Salt", salt);
    console.log("Password", req.body.password);

    req.body.password = await bcrypt.hash(req.body.password, salt);

    console.log(req.body.password);
    const users = new usersData({
      firstName: req.body.fname,
      lastName: req.body.lname,
      email: req.body.email,
      password: req.body.password
    })

    var response = await users.save();
    res.send(response);
  } catch (err) {
    console.log("err in salt", err);
  }

},
exports.validateUser = async(req,res,next)=>{
  console.log(req.body);
  const schema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
  })
  var {error} =await schema.validate(req.body);
  if(error){
    return res.status(400).send({msg:error.details[0].message})
  }
   const user = await usersData.findOne({ email: req.body.email })
   console.log("user",user);
 if(user == null){
  return res.send({error:"email doesnt exist"});
 }
 console.log("reqpassowrd",req.body.password);
 console.log("userpassword",user.password)
 const isValid = await bcrypt.compare(req.body.password,user.password);
 console.log(isValid);
 if(!isValid){
  console.log("im hete");
 return res.send({error:"Invalid Password"})
}
const authToken = jwt.sign({userId:user._id,email:user.email},"GUvi!jdks",{expiresIn:"10h"});
console.log(authToken);
res.send({authToken,user});
}
