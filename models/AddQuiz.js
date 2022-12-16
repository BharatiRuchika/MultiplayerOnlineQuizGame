const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const quizSchema = new Schema({
    quizName:{
        type:String,
       
        maxLength:25,
        required:true
    },
    quizDescription:{
        type:String,
      
        required:true
    },
    userId:{
        type:String
    }

})
const addQuiz = mongoose.model("addQuiz",quizSchema,"AddQuiz");
module.exports = addQuiz;