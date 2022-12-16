import React from 'react';
import Check from '../animations/Check';
import Incorrect from '../animations/Incorrect.js';

export default function PlayerQuestionOver(props){
  
    console.log("props",props);
    return (
        <div>
            {
                props.answeredCorrect
                ?
                <div className='answer correct' >
                    <h1 className='answer-indicator' >Correct</h1>
                        <Check/>
                </div> 
                :
                <div className='answer incorrect' >
                    <h1 className='answer-indicator' >Incorrect</h1>
                    
                        <Incorrect/>
                </div> 
            }           
        </div> 
    )
}