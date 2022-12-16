import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleNickname, selectedPin} from '../../Reducer/Reducer';
import Socket from "../../Socket";
import './Landing.css';
import Kwizz from '../../Assets/Kwizz.svg';
import Kwizzard from '../../Assets/Kwizzard--test-pixel.svg'
import Stars from '../animations/Stars.js';
class Landing extends Component {
    constructor() {
        super();
        this.state = {
            pin: '',
            nickname: '',
            toggle: false
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleNicknameInput = this.handleNicknameInput.bind(this);
       
        this.handleGo = this.handleGo.bind(this)
    }
   
    componentDidMount(){
        Socket.on("host_presence",()=>{
            console.log("im in host_presence");
            alert("This pin is not exist")
        })
        Socket.on("valid",(data)=>{
            console.log("im in valid");
            console.log("data",data);
          if(data==true){
            this.props.selectedPin(this.state.pin)
            this.setState({
             toggle: true
         })
        } else{
            alert("This pin is not exist")
        }
    })
    }
  
    handleInput(e) {
        console.log("this",this);
        this.setState({
            pin: e.target.value
        })
    }
    handleToggle() {
        // Socket.on("host_presence",()=>{
        //     console.log("im in host_presence");
        //     alert("This pin is not exist")
        // })
        console.log("props",this.props);
        if(this.state.pin==""){
            alert("enter game pin first");
        }else{
        Socket.emit('pin-entered',this.state.pin);      
    
}
}       
    
    handleNicknameInput(e) {
        this.setState({
            nickname: e.target.value
        })
    }
    handleGo() {
        if(this.state.nickname==""){
            alert("please enter nickname")
        }else{
        this.props.handleNickname(this.state.nickname);
        this.props.history.push("/player");
        }
    }
    redirect(){
        console.log("im here");
        // return <Redirect to='/quiz/questions'/>
    }
    
    render() {
        return (
            <>
            
            <div className='component-container' >
            <div>
            
                {/* <Stars/> */}
                </div> 
                {
                    !this.state.toggle
                        ?
                        <div className='landing-wrapper' >
                            <div className='logo-container' >
                            <img src={Kwizz} alt='Kwizz logo' className='logo'/>
                            </div> 
                            <div className='player-input-wrapper' >
                                <input type='number' value={this.state.pin} placeholder='Kwizz! PIN' onChange={this.handleInput} className='input-user'/>
                                <button onClick={this.handleToggle} className='btn-enter'>Enter</button>
                            </div> 
                        </div>
                        :
                        
                        <div className='landing-wrapper' >
                          <div className='logo-container' >
                            <img src={Kwizz} alt='Kwizz logo' className='logo'/>
                          </div> 
                          
                            <div>
                                <input type='text' value={this.state.nickname} placeholder='Nickname' onChange={this.handleNicknameInput} className='input-user' />
                              <button onClick={this.handleGo} className='btn-enter' >OK, go!</button>
                                
                            </div> 
                         </div>
                         
                       
                }
                <div style={{marginLeft:'550px',alignItems:'center',color:'white'}}>
           
                <p>Crete your own kahoot for</p>
                <p>Free at
                    
                <Link to='/home' className='btn-link'>
                <b style={{cursor:'alias',color:'white'}}> kahoot.com</b>
                 </Link>
                   </p>
           
            </div>
                {/* <div className='logo-host' >
                    <img src={Kwizzard} alt='' className='kwizzard'/>
                    <div className='btn-host' >
                        <a id='atag' href='http://localhost:3030/auth'>HOST</a>
                    </div>
                </div> */}
               
            </div>
        
         </>  
            
        )
    }
}



export default connect(null,{selectedPin,handleNickname })(Landing)
// export default connect(mapStateToProps,mapDispatchToProps)(Landing)
