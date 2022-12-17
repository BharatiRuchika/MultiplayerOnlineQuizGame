import React, { Component } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import {  selectedPin ,editHostPins} from '../../Reducer/Reducer';
import sound1 from '../../Assets/counter.wav';
import GameQuestions from './Game_Questions';
import GameQuestionOver from './Game_Question_Over';
import Socket from "../../Socket";
import sound from '../../Assets/ting.mp3';
import jwt from "jsonwebtoken";
import "./Game.css";
class Game extends Component {
    constructor() {
        super();
        this.state = {
            pin: 0,
            timer: 20,
            isLive: false,
            questionOver: false,
            gameOver: false,
            currentQuestion: 0,
            questions: [],
            players: [],
            playersLength:'false',
            playerCounter: 0,
            leaderBoard: [],
           
        }
        this.questionOver = this.questionOver.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.audio = new Audio(sound);
        this.audio1 = new Audio(sound1);
    }
    async componentDidMount() {
        var connectionOptions = {
            "force new connection" : true,
            "reconnect":true,
            "reconnectionAttempts": "Infinity",
            "timeout" : 10000,				
            "transports" : ["websocket"]
        };
        const token = localStorage.getItem("token");
        console.log("token",token);
       console.log("game component mounted");
      console.log("players",this.state.players);
      console.log("props",this.props);
    
        var res = await axios.get(`http://localhost:3001/quizquestions/getQuestions/${this.props.quiz._id}`,{
            headers:{
                'auth-token':token
            }
        })
       this.setState({ questions: res.data })
    
    
       this.generatePin();

        Socket.on('room-joined', (data) => {
            console.log("game room joined",data);
           this.addPlayer(data.name, data.id,data.pin)
        })
        Socket.on('host-joined', (data) => {
            console.log("host room joined",data);
           this.addHost( data.id)
        })
       Socket.on('player-answer', (data) => {
            this.submitAnswer(data.name, data.answer)
        })
        Socket.on("left",(data)=>{
            console.log("left event call");
            console.log("data",data);
            this.removePlayer(data.id);
        })
        Socket.on("pin-checked",(data)=>{
            console.log("data",data);
            console.log("pin",data.pin);
            console.log(data.len,data.clen);
            var length = data.len;
            var current_length = data.clen;
            console.log("game pin",this.state.pin);
            if(data.pin==this.state.pin){
                var valid = true;
            }else{
                var valid = false;
            }
            console.log("valid",valid);
                if(valid==true){
                    current_length= length;
                    Socket.emit("valid",valid);
                }else{
                    if(data.len==data.clen){
                        Socket.emit("valid",valid);
                    }
                }
            
        })
    }
    removePlayer(id){
        let { players } = this.state;
        console.log("players",players);
        const result = players.filter(player => player.id != id);
       console.log("result",result);
       this.setState({players:result},() => {
        console.log(this.state.players, 'players')});
       
    }
    generatePin() {
        console.log("generate pin called");
        console.log("props",this.props);
        let newPin = Math.floor(Math.random() * 9000, 10000)
        // console.log("pin", newPin);
        this.setState({ pin: newPin })
        Socket.emit('host-join', { pin: newPin });
        this.props.selectedPin(this.state.pin)
        this.props.editHostPins(this.state.pin);
       
       
    }
    startGame() {
        // console.log("Game Started");
        let { players } = this.state;
        console.log("players", players);
      console.log("players length",players.length);
       if (players[0] && players[1]){
            this.nextQuestion()
            this.setState({
            isLive: true
        })
        } else {
            alert('You need at least 2 players to start')
        }
        // this.nextQuestion();
        // this.setState({
        //     isLive: true
        // })
    }
    questionOver() {
        console.log("question over call");
        let { pin, players } = this.state
        // console.log("pin", pin);
        Socket.emit('question-over', { pin })
        let updatedPlayers = [...players];
        updatedPlayers.forEach((player) => {
            player.qAnswered = false;
            player.answeredCorrect = false;
        })
        this.getLeaderBoard()
        this.setState({
            questionOver: true,
            currentQuestion: this.state.currentQuestion + 1,
        })
    }
    timeKeeper() {
        let internalTimer = 20;
        console.log("timekeeper called");
        let players = [...this.state.players]
        console.log("players",players);
        this.setState({ questionOver: false })
        timeCheck = timeCheck.bind(this)
        function timeCheck() {
            // console.log("timecheck called");
            console.log("internaleTimer",internalTimer);
            let checkAnswers = () => {
                let pAnswered = 0;
                players.forEach((player) => {
                    
                    return player.qAnswered ? ++pAnswered : null
                })
               
                    players.forEach(player => {
                        // console.log("correct/incorrect",player.answeredCorrect);
                       
                        if (player.answeredCorrect) {
                            console.log(player.name+"answer correctlye")
                            console.log("internal timer" + internalTimer);
                            var score = (internalTimer*10+1000);
                            console.log("score",score);
                            player.score += (internalTimer * 10 + 1000);
                            Socket.emit('sent-info', { id: player.id, pin:this.state.pin,score: player.score, answeredCorrect: player.answeredCorrect })
                        }
                    });
                
                    console.log("internal timer" + internalTimer)
                   if(internalTimer==4){
                    this.audio1.play();
                   }
                   return pAnswered === players.length ? internalTimer=0 : internalTimer-=1;
                // return internalTimer -= 1;
            }
            let endQuestion = () => {
                clearInterval(timeKept);
                this.questionOver();
            }
          
            return internalTimer > 0
                ? checkAnswers()
                : endQuestion()
        }
        let timeKept = setInterval(() => { timeCheck() }, 1000);
        return timeKept
    }

    nextQuestion() {
        console.log("next question called");
        let { pin, questions, currentQuestion } = this.state;
        this.timeKeeper();
       
if(currentQuestion===questions.length){
    this.setState({ gameOver: true })
    Socket.emit('game-over')
}else{
    Socket.emit('next-question', { pin })
}
        // currentQuestion === questions.length
        //     ? this.setState({ gameOver: true })
        //     this.Socket.emit('question-over')
        //     :
            // this.Socket.emit('next-question', { pin })
        this.setState({ questionOver: false })
    }
    addHost(id){
        this.setState({HostId:id});    
    }
    addPlayer(name, id,pin) {

       if(pin==this.state.pin){
        this.audio.play();
        // this.setState({id:id})
        //  audio.play();
        console.log("add player call");
        console.log("add player name", name);
        // console.log("id",id);
        console.log("players",this.state.players);
        console.log(id+""+pin);
        var new_id = id+""+pin;
        // console.log("add player id", id);
        let player = {
            id:id,
            // this is now their socket id so they can pull their score to the player component using this
            name: name,
            score: 0,
            qAnswered: false,
            answeredCorrect: false
        }
        console.log("player",player);
        let newPlayers = [...this.state.players]
        newPlayers.push(player)
        console.log("newPLayers", newPlayers);
        this.setState({
            players: newPlayers,
            playerCounter: this.state.playerCounter + 1
        },() => {
            console.log(this.state.players, 'players')})
    }
   
    }
    submitAnswer(name, answer) {
        console.log("Game submit answer call");
        console.log("name", name);
        console.log("answer", answer);
        console.log("players",this.state.players);
        let player = this.state.players.filter(player => {
            console.log("play",player);
            return player.name === name;
        })
        console.log("player",player);
        let updatedPlayers = this.state.players.filter(player => player.name !== name);
        console.log("updatedPlayers",updatedPlayers);
        // player.forEach(play => {
        //     console.log("play",play);
        //     play.qAnswered = true;
        // }
        console.log("false",player.qAnswered);
        player[0].qAnswered = true;
        // player[0].qAnswered = true;
        console.log("correctAnswer",this.state.questions[this.state.currentQuestion].correctAnswer);
        answer === this.state.questions[this.state.currentQuestion].correctAnswer
            ? player[0].answeredCorrect = true
            : player[0].answeredCorrect = false

        updatedPlayers.push(player[0])
        this.setState({
            players: updatedPlayers
        })

    }

    getLeaderBoard() {
        console.log("leaderboard gets called");
        let unsorted = [...this.state.players];
        console.log(this.state.players);
        let leaderboard = unsorted.sort((a, b) => b.score - a.score)
        console.log("leaderboard",leaderboard)
        this.setState({
            leaderBoard: leaderboard
        })
    }
   

    render() {
      
       
        console.log(this.props);
        var userId = this.props.match.params.id;
        console.log("userId",userId);
        let { pin, questions, currentQuestion, isLive, questionOver, gameOver,playersLength } = this.state;
        // let mappedPlayers = this.state.players;
        let mappedPlayers = this.state.players.map(player => {
            return (
                <>
               <h2 key={player.id}>{player.name} Joined the game</h2></>
            )
        })
        return (
            <div className='component-container' >
                <div>
                    <p>Kwizz Pin</p>
                    <h1>{pin}</h1>
                </div>
                {
                   
                    !isLive && !questionOver && !gameOver ?
                        <div className='btn-players' >
                            <button onClick={() => this.startGame()} className='btn-play' >Play</button>
                            <p className='player-name' id='player-join'>Players joined!</p>
                           
                            {mappedPlayers}
                        </div>
                        :
                        isLive && !questionOver && !gameOver ?
                            <GameQuestions
                                question={questions[currentQuestion].question}
                                answer1={questions[currentQuestion].answer1}
                                answer2={questions[currentQuestion].answer2}
                                answer3={questions[currentQuestion].answer3}
                                answer4={questions[currentQuestion].answer4}
                                questionOver={this.questionOver} />
                            :
                            <GameQuestionOver
                                nextQuestion={this.nextQuestion}
                                leaderboard={this.state.leaderBoard}
                                lastQuestion={this.state.questions.length === this.state.currentQuestion}
                                userId={userId} 
                               />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log("state",state)
    return {
        quiz: state.quiz,
        selectedPin:state.selectedPin,
        hostPinsArray:state.hostPinsArray
    }
}
// export default connect(null, {selectedPin })(Game)
export default connect(mapStateToProps, {selectedPin ,editHostPins})(Game)

// export default connect(mapStateToProps)(Game)
// export default connect(mapStateToProps,{selectedPin})(Game)