const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const usersSchema = new Schema({
   
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        minLength:5,
        required:true
    }
})
const usersData = mongoose.model("Users",usersSchema,"users");
module.exports = usersData;