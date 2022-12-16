var express = require('express');
var router = express.Router();

/* GET users listing. */
const usersModule = require("../module/usersModule");
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/addUser',usersModule.addUser);
router.post('/validateUser',usersModule.validateUser);
module.exports = router;
