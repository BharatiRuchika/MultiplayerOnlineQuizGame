var express = require("express");
var router = express.Router();
const quizQuestionsModule = require("../module/quizQuestionsModule");
router.post("/addQuestions",quizQuestionsModule.addQuestions);
router.get("/getQuestions/:id",quizQuestionsModule.getQuestions);
router.get("/getQuestion/:id",quizQuestionsModule.getQuestion);
router.put("/updateQuestion/:quizId/:id",quizQuestionsModule.updateQuestion);
router.delete("/deleteQuestion/:id",quizQuestionsModule.deleteQuestion);
module.exports = router;