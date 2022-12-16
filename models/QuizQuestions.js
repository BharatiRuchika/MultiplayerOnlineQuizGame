const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizQuestionsSchema = new Schema({
    quizId:{
        type:String,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    answer1:{
        type:String,
        required:true
    },
    answer2:{
        type:String,
        required:true
    },
    answer3:{
        type:String,
        required:true
    },
    answer4:{
        type:String,
        required:true
    },
    
    correctAnswer:{
        type:Number,
        required:true
    }
})


const quizQuestions = mongoose.model("quizQuestions",quizQuestionsSchema,"QuizQuestions");
module.exports = quizQuestions;
