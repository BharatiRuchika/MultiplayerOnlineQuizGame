import React from 'react';
import './animate.css';
import IncorrectPath from '../../Assets/incorrect-path';
import sound from '../../Assets/wrong.mp3';
export default function Incorrect(){
 
    React.useEffect(()=>{
        const audio = new Audio(sound);
        audio.play();
    },[])
    return(
        <div className='check-wrapper' >
            {IncorrectPath}
        </div> 
    )
}