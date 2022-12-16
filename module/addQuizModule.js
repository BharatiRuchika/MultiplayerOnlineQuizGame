const Quiz = require('../models/AddQuiz');
exports.createQuiz = async(req,res,next)=>{
   const quiz = new Quiz({
    quizName:req.body.quizName,
    quizDescription:req.body.quizDescription,
    userId:req.body.userId
   })
   try{
        var response = await quiz.save();
        res.send(response);
   }catch(err){
       console.log(err);
       res.send(err);
   }
}
exports.findQuiz = async(req,res,next)=>{
  var response = await Quiz.find();
  res.send(response);
}
exports.updateQuiz = async(req,res,next)=>{
  const id = req.params.id;
  var response = await Quiz.findByIdAndUpdate(id,{
    quizName:req.body.quizName,
    quizDescription:req.body.quizDescription
  })
  res.send(response);
}
exports.deleteQuiz = async(req,res,next)=>{
    const id = req.params.id;
    console.log("id",id);
    var response = await Quiz.findByIdAndRemove(id);
    res.send(response);
}
exports.getQuiz = async(req,res,next)=>{
  const id = req.params.id;
  var response = await Quiz.find({_id:id})
  res.send(response);
}
exports.getQuizzes = async(req,res,next)=>{
  console.log("user quiz",req.user);
  const id = req.user.userId;
  var response = await Quiz.find({userId:id});
  res.send(response);
}