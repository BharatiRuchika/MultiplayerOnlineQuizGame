import React from 'react';
import './animate.css';
import check from '../../Assets/check-path';
import sound from '../../Assets/correct.wav';
export default function Check(){
    React.useEffect(()=>{
        const audio = new Audio(sound);
        audio.play();
    },[])
    return(
        <div className='check-wrapper' >
            {check}
        </div> 
    )
}