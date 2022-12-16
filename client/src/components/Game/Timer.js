import React, { Component } from 'react';
import sound from '../../Assets/counter.wav';
export default class Timer extends Component {
    constructor() {
      super();
      this.state = { time: {}, seconds: 20 };
      this.timer = 0;
      this.startTimer = this.startTimer.bind(this);
      this.countDown = this.countDown.bind(this);
      this.audio = new Audio(sound);
    }
  
    secondsToTime(secs){
      let hours = Math.floor(secs / (60 * 60));
      // console.log("hours",hours)
      let divisor_for_minutes = secs % (60 * 60);
      // console.log("divisor_for_minutes",divisor_for_minutes)
      let minutes = Math.floor(divisor_for_minutes / 60);
      // console.log("minutes",minutes);
      let divisor_for_seconds = divisor_for_minutes % 60;
      // console.log("divisor_for_seconds",divisor_for_seconds);
      let seconds = Math.ceil(divisor_for_seconds);
      // console.log("seconds",seconds);
      let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
      };
      return obj;
    }
  
    componentDidMount() {
      let timeLeftVar = this.secondsToTime(this.state.seconds);
      // console.log("timeLeftVar",timeLeftVar);
      this.setState({ time: timeLeftVar });
      this.startTimer();
    }
  
    startTimer() {
      if(this.timer==4){
        this.audio.play();
      }
      if (this.timer == 0) {
        this.timer = setInterval(this.countDown, 1000);
      }
    }
  
    countDown() {
      let seconds = this.state.seconds - 1;
      // console.log("seconds",seconds);
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
      });
      
      if (seconds == 0) { 
        clearInterval(this.timer);
      }
    }
  
    render() {
      return(
        <div className='timer'>
         Seconds Left: {this.state.time.s}
        </div>
      );
    }
  }