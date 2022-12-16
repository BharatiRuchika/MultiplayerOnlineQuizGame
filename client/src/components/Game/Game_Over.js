import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import Zoom from '../animations/zoomin.js';
import Socket from "../../Socket";
import { connect } from 'react-redux';
import { handleNickname, selectedPin } from '../../Reducer/Reducer';
import './Game.css';
import sound from '../../Assets/game_over.wav';

function GameOver(props){
    
    useEffect(()=>{
        // Socket.emit('hostend',props.selectedPin);
        Socket.emit("destroy",props.selectedPin);
       
            const audio = new Audio(sound);
            audio.play();
       
    },[])
    // const startConnection=()=>{
    //     console.log("connection restart");
    //     Socket.emit('startConnect');
    // }
    console.log("gameoverprops",props);
   
    return(
        <div className='game-over'>
            <Zoom/>
            <h1 className='leaderBoard-title'>Game Over</h1>
            <br/>
            <h2 style={{color:"white"}} className='leaderBoard'>1st Place: {props.leaderboard[0].name}</h2>
            <h2 className='leaderBoard'>2nd Place: {props.leaderboard[1].name}</h2>
            <h2 className='leaderBoard'>Last Place: {props.leaderboard.pop().name}</h2>
            <br/>
           
        </div> 
    )
}


function mapStateToProps(state) {
    console.log("state",state);
    return {
        selectedPin: state.selectedPin,
        
    }
}

export default connect(mapStateToProps)(GameOver);
