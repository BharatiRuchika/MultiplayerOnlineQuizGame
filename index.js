require('dotenv').config()

const express = require('express')
    ,session = require('express-session')
    ,jwt = require("jsonwebtoken")
    ,passport = require('passport')
    ,Auth0Stratagy = require('passport-auth0')
    ,massive = require('massive')
    ,bodyParser = require('body-parser')
    ,{Quiz} = require('./utils/quiz')

  

const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    CONNECTION_STRING,
    FRONTEND_URL
} =  process.env;



var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addQuizRouter = require('./routes/addQuiz');
var quizQuestionsRouter = require('./routes/quizQuestions');
// const http = require("http");

var mongo = require("./connection");
const { Socket } = require('socket.io');
mongo.connect();

var app = express();
// app.use(cors({   origin: true,   credentials: true }))
// app.use(cors({ credentials: true }));
// const socket = require('socket.io');
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', "*");
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type Accept');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(function (req, res, next) {
  console.log("environment",process.env.NODE_ENV)
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
// const port = process.env.PORT;
const  {createServer}  = require("http");
const {Server} = require("socket.io");
const httpServer = createServer(app);
// const srver = require('http').createServer(app)

const io = new Server(httpServer,{
  cors: {
    origin: true,
    credentials:true,      
    optionSuccessStatus:200

  }}
  );



const users = {};
var clients = {};
var hosts={};
var socketArray=[];
var hostObject={};
var hostArray=[];
// let currentConnections = {};
var host=0;
// var hostSocketArray = {};
io.on('connection', socket => {
 
  // clients[socket.id] = socket;
 console.log("socketid",socket.id);
//  currentConnections[socket.id] = { socket: socket };
    console.log("connection established");
    // io.sockets.emit('conn')
  socket.on('host-join', (data) => {
    host++;
    console.log("host",host);
    console.log("socketId",socket.id);
    // hostObject.hostId = socket.id;
    hostArray.push(socket.id);
    console.log("hostArray",hostArray);
    // hosts[socket.id] = socket.id;
    // socket["socketid"] = socket.id
    console.log("host join");
 
    console.log("data",data);
    var selectedPin = data.pin;
    io.sockets.emit('host-joined',{id:socket.id})
    // users[socket.id] = data.nickname;
   socket.join(selectedPin);  
  })
  
  socket.on('player-joined', (data) => {
  // users[socket.id] = data.nickname;
  // onlineUsers[username] = socket.id;
  users[socket.id] = socket.id;
  // socket["username"] = username;
  // socket["socketid"] = socket.id;
    console.log("player joined");
    console.log("data",data);
   console.log("player",socket.id);
  var nickname = data.nickname;
  console.log("nickname",nickname);
  var selectedPin = data.selectedPin;
  console.log("SelectedPin",selectedPin);
  
    socket.join(selectedPin);
   
    
  })
  //Add player to Quiz Object
 

socket.on('player-add', (data)=> {
  console.log("player add");
  // console.log("socket",socket);
  // const { error, user } = addUser(
  //   { id: socket.id, name:data.nickname, room :data.selectedPin});
  var pin = parseInt(data.selectedPin);
  console.log("selectedpin",typeof pin);
  console.log("player_data",data.nickname);
  console.log("player_data",socket.id);
 io.sockets.emit("hello");
//  socket.to(`${data.selectedPin}`).emit('room-joined', {name: data.nickname, id: socket.id});
 io.sockets.emit('room-joined', {name: data.nickname, id: socket.id,pin:data.selectedPin});
  
  
})

  socket.on('question-over', (data) => {
    console.log("question over call");
    console.log("pin",data.pin);
    io.sockets.emit('question-over');
  })
    socket.on('next-question', (data) => {
    console.log("next question called");
    console.log("pin",data);
    // socket.to(`${data.pin}`).emit('next-question');
    io.sockets.emit('next-question');
})
  socket.on('question-answered', (data) => {
    console.log("question answered called");
    console.log("pin",data.pin);
    console.log("data",data);
    io.sockets.emit('player-answer', {name : data.name, answer: data.answer})
  })
  socket.on('sent-info', (data) => {
    console.log("sent-info called");
    console.log("data",data);
    var new_id = data.id+""+data.pin;
    io.to(data.id).emit('sent-info', {answeredCorrect: data.answeredCorrect, score: data.score});
})
socket.on("game-over",()=>{
  io.sockets.emit('game-over')
})

socket.on('end', function (pin){
  console.log("socket disconnect");
  console.log("socketId",socket.id);
  const user = removeUser(socket.id);
  var getusers = getUsersInRoom(pin);
  console.log("users",getusers);
  socket.disconnect();
   
});
socket.on('destroy', function (data) {
  console.log("data",data);
  console.log('A user disconnected');
  io.sockets.emit('left', {id:socket.id});
  // delete currentConnections[socket.id];
  socket.leave(data); 
  // socket.disconnect();
});
socket.on("pin-entered",(pin)=>{
  console.log("pin entered called");
  console.log(hostArray);
  // console.log(hostArray["hostsocketid"]);
  // var id = socketArray["socketid"];
  console.log("pin",pin);
  socketArray.push(socket.id);
  var id = socketArray[0];
  if(host>=1){
    var i = 0;
  hostArray.map(hostId=>{
    console.log("im here");
    i++;
    console.log("i",i);
    console.log("lengty",hostArray.length);
      io.to(`${hostId}`).emit("pin-checked",{pin:pin,len:hostArray.length,clen:i});
  })
}else{
  console.log("im here");
  io.to(`${id}`).emit('host_presence');
}

})
  socket.on("valid",(valid)=>{
    console.log("valid called",valid);
    console.log("socketArray",socketArray);
    var id = socketArray[0];
    console.log("id",id);
  
      // var id =socketid;
      io.to(`${id}`).emit('valid',valid);
      socketArray=[];
   
  // var id = socketArray["socketid"];
  // console.log("socketArray",socketArray["socketid"]);
  // console.log("valid called");
 
})
socket.on("disconnect",function(){
  if(hosts[socket.id]==socket.id){
    host--;
  }
  io.sockets.emit('left',{id:socket.id})
})
 
 
})

/

///////auth0
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new Auth0Stratagy({
//   domain:DOMAIN,
//   clientID:CLIENT_ID,
//   clientSecret:CLIENT_SECRET,
//   callbackURL:CALLBACK_URL,
//   scope:'openid profile'
// }, (accessToken, refreshToken, extraParams, profile, done)=> {
//   //DB calls here 
//   const db = app.get('db');
//   let {id, displayName, picture} = profile
//   db.get_user([id])
//       .then(user=>{
//           if(user[0]){
//               done(null,user[0].id)
//           }else{db.add_user([displayName, id])
//               .then((createdUser)=>{
//                   done(null, createdUser[0].id)
//               })
//           }
//       })
// }))

// passport.serializeUser( (primaryKeyID,done)=>{
//   done(null, primaryKeyID)
// })
// passport.deserializeUser( (primaryKeyID,done)=>{
//   app.get('db')
//       .find_session_user([primaryKeyID])
//       .then(user=>{
//           done(null, user[0])
//       }) 
// })

// function check(req,res,next) {
//   if(req.user){res.redirect(`${process.env.FRONTEND_URL}#/host`)
//   } else {next()}
// }
// app.use( (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3001"); //The ionic server
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use((err,req,res,next)=>{
//   next();
// })

// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'pug');
// if(process.env.NODE_ENV=="production"){
//   const path = require("path");
//   app.get("/",(req,res,err)=>{
//     console.log("im here");
//     app.use(express.static(path.resolve(__dirname,'client','build','index.html')))
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'),(err,data)=>{
//       if(err){
//         console.log("err",err);
//       }
//     });
//   })
// }
// app.use(express.static(path.join(__dirname, 'client/build')))

console.log("dirname",express.static(path.join(__dirname,"client/build")));
if(process.env.NODE_ENV==="production"){
  
  const path = require("path");
  app.use(express.static(path.join(__dirname,"client/build")));
  app.get('/', (req, res) => {
  // res.sendFile(`./index.html`);
  // res.sendFile(__dirname + '/public/main.html');
  // res.sendFile('index.html', {root: 'public'});
  // res.send("im run");
  
    // res.sendFile(path.join(__dirname, 'build', 'index.html'));

  res.sendFile(path.join(__dirname,'client','build','index.html'))
})
}
// app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use((req,res,next)=>{
//   console.log("im here");
//   const token = req.headers["auth-token"];
//   console.log("token",token);
//   if(token){
//     console.log("im here also");
//     try{
//     req.user = jwt.verify(token,"GUvi!jdks");
//     // console.log("users",user);
//     next();
//     }catch(err){
//       res.sendStatus(401);
//     }
//   }else{
//     res.sendStatus(401);
//   }
  
// })
app.use('/quiz', addQuizRouter);
app.use('/quizquestions',quizQuestionsRouter);
// catch 404 and forward to error handler
//console.log("port",process.env.HTTP_PORT)
const PORT = process.env.PORT||3001;
console.log(PORT)
httpServer.listen(PORT, () => {
 console.log("s Is Running Port: " + PORT);
});
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  res.json({ error: err })
});

module.exports = app;
