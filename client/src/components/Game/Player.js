import React, { Component } from 'react';
import { connect } from 'react-redux';
import {io} from 'socket.io-client';
import Socket from "../../Socket";
import PlayerQuestions from './Player_Questions';
import PlayerQuestionOver from './Player_Question_Over';
import './Game.css';
import Player_Game_Over from './Player_Game_Over';
import load from '../../Assets/load-circle-outline.svg'
// import sound from '../../Assets/ting.mp3';
class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pinCorrect: false,
            gameStarted: false,
            gameOver:false,
            questionOver: false,
            answerSubmitted: false,
            answeredCorrect: false,
            score: 0,
            conn:0
        }
        this.submitAnswer = this.submitAnswer.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        
   
    }
    componentDidMount() {
      
        var connectionOptions = {
            "force new connection" : true,
            "reconnect":true,
            "reconnectionAttempts": "Infinity",
            "timeout" : 10000,				
            "transports" : ["websocket"]
        };
       
        console.log("socket",this.Socket);
      
        console.log("im here");
        console.log("props",this.props);
        console.log("props",typeof this.props.selectedPin);
        var pin = parseInt(this.props.selectedPin);
        console.log("intprops",typeof pin);
        Socket.emit('player-joined', this.props);
        Socket.emit('player-add', this.props)
        console.log("player added");
        Socket.on('question-over', () => {
            console.log("question over call");
            this.setState({
                questionOver: true
            })
        })
        Socket.on("game-over",()=>{
            this.setState({
                gameOver: true
            })
        })
        Socket.on('next-question', () => {
            this.setState({
                gameStarted: true,
                questionOver: false,
                answerSubmitted: false,
                answeredCorrect: false
            })
        })
        Socket.on('sent-info', data => {
            console.log("sent-info",data);
            console.log(this.state.score);
            this.setState({
              answeredCorrect: data.answeredCorrect,
              score: this.state.score + data.score
            })
        })
      
    }
    submitAnswer(num){ 
        console.log("submit answer call");
        console.log("num",num);
        console.log("props",this.props);
        Socket.emit('question-answered', {name: this.props.nickname, answer: num, pin: this.props.selectedPin})
        this.setState({
            answerSubmitted: true
        })
    }
    leaveRoom(){
        Socket.emit('destroy',this.props.selectedPin); 
        this.props.history.push("/");
    }
    render() {
        console.log(this.props)
        let { gameStarted, questionOver, answerSubmitted ,gameOver} = this.state;
        return (
            <div className='player-container' >
                <div className='status-bar'>
                    <p className='player-info' id='pin' >PIN:{this.props.selectedPin}</p>
                    <button onClick={this.leaveRoom}>Leave room</button>
                </div> 
                 
                {
                    !gameStarted && !questionOver && !gameOver
                    ?
                    <div>
                            <p>You're in!
                             <br />
                                Do you see your nickname on the screen?
                            </p>
                             <div className='answer-container'>
                                    <div className=' q-blank q'></div> 
                                    <div className=' q-blank q'></div> 
                                    <div className=' q-blank q'></div> 
                                    <div className=' q-blank q'></div> 
                             </div> 
                        </div>
                        :
                        gameStarted && !questionOver && !answerSubmitted && !gameOver
                        ?
                        <PlayerQuestions submitAnswer ={this.submitAnswer} />
                        :
                        gameStarted && !questionOver && answerSubmitted && !gameOver
                        ?
                        <div className='waiting-for-results' >
                            <p className='answer-indicator' id= 'too-fast'>Did You answer too fast????</p>
                            <img src={load} alt='' className='load-circle' />
                        </div> 
                        :
                        gameStarted && questionOver && answerSubmitted && !gameOver
                        ?
                        <PlayerQuestionOver
                         answeredCorrect={this.state.answeredCorrect}
                        />
                        :
                        <Player_Game_Over/>
                    }
                    <div className='status-bar' >
                    
                    <p className='player-info'>{this.props.nickname}</p>
                    <div 
                        className={ 
                          gameStarted && !questionOver && answerSubmitted
                          ?
                          'status-bar-hidden'
                          :
                          'status-bar-score'
                        }
                         >{this.state.score}</div> 
                    </div> 
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log("state",state);
    return {
        selectedPin: state.selectedPin,
        nickname: state.nickname
    }
}

export default connect(mapStateToProps)(Player);