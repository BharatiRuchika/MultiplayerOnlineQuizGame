import React from 'react';
import './Game.css';
import triangle from '../../Assets/triangle.svg'
import diamond from '../../Assets/diamond.svg'
import square from '../../Assets/square.svg'
import circle from '../../Assets/circle.svg';
import sound from '../../Assets/start.wav';
export default function PlayerQuestion(props){
    React.useEffect(()=>{
        console.log("player question scomponent");
        console.log("props",props);
        const audio = new Audio(sound);
        audio.play();
    },[])
   
    return (
        <div className='answer-container'>
            <div className='q1' onClick={() => props.submitAnswer(1)}>
                <img src={triangle} alt='' className='shape' />
            </div> 
            <div className='q2' onClick={() => props.submitAnswer(2)}>
                <img src={diamond} alt=''className=' shape'/>
            </div> 
            <div className='q3' onClick={() => props.submitAnswer(3)}>
                <img src={square} alt=''className='shape'/>
            </div> 
            <div className='q4' onClick={() => props.submitAnswer(4)}>
                <img src={circle} alt=''className='shape'/>
            </div> 
        </div> 
    )
}