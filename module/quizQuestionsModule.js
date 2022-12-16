const quizQuestions = require("../models/QuizQuestions");
exports.addQuestions = async(req,res,next)=>{
    // var id = req.params.id;
    const questions = new quizQuestions({
        quizId:req.body.id,
        question:req.body.question,
        answer1:req.body.answer1,
        answer2:req.body.answer2,
        answer3:req.body.answer3,
        answer4:req.body.answer4,
        correctAnswer:req.body.correctAnswer  
    })
    try{
       var response = await questions.save();
       res.send(response);
    }catch(err){
      console.log(err);
      res.send(response);
    }
}
exports.getQuestions = async(req,res,next)=>{
   var id = req.params.id;
    try{
    var response = await quizQuestions.find({quizId:id});
    res.send(response);
    }catch(err){
        console.log(err);
        res.send(err);
    }
}
exports.getQuestion = async(req,res,next)=>{
    var id = req.params.id;
    try{
    var response = await quizQuestions.find({_id:id})
    res.send(response);
}catch(err){
    console.log(err);
}
}
exports.deleteQuestion = async(req,res,next)=>{
    var id = req.params.id;
    try{
     var response = await quizQuestions.findByIdAndRemove(id); 
     res.send(response);
     console.log(response);
    }catch(err){
        console.log(err);
    }
}
exports.updateQuestion = async(req,res,next)=>{
    var id = req.params.id;
    var quizId = req.params.quizId;
   
    try{
     var response = await quizQuestions.findByIdAndUpdate([id,quizId],{
         question:req.body.question,
         answer1:req.body.answer1,
         answer2:req.body.answer2,
         answer3:req.body.answer3,
         answer4:req.body.answer4,
         correctAnswer:req.body.correctAnswer,

     }); 
     res.send(response);
    }catch(err){
        console.log(err);
    }
}