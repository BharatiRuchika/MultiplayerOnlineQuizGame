import React, { Component } from 'react';
import axios from 'axios'
import {Redirect}from "react-router-dom"
import {connect} from 'react-redux'
import QuizComponent from './QuizComponent';
import AddAnswersComponent2 from './AddAnswersComponent2';
import {editingQuiz} from '../../Reducer/Reducer';
import jwt from "jsonwebtoken";
class New_Quiz extends Component {
    constructor(){
        super();
        this.state= {
            quiz_name: '',
            info: '',
            redirect: false
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleTextarea = this.handleTextarea.bind(this);
        this.createQuiz = this.createQuiz.bind(this);
    }
    componentDidMount() {
        console.log("props", this.props);
    }
    handleInput(e){
        this.setState({
            quiz_name: e.target.value
        })
    }
    handleTextarea(e){
        this.setState({
            info: e.target.value
        })
    }
    async createQuiz(){
        if(this.state.quiz_name==""){
            alert("enter quiz name");
        }else
        if(this.state.info==""){
            alert("enter quiz description");
        }else{
       
        var userId = this.props.match.params.id;
        console.log("newQuiz",userId);
        const token = localStorage.getItem("token")
        var res = await axios.post('http://localhost:3001/quiz/addQuiz', {quizName: this.state.quiz_name, quizDescription: this.state.info,userId
        },{
            headers:{
                'auth-token':token
            }
        })
        console.log("res",res);
        console.log("response",res.data._id);
           this.props.editingQuiz(res.data);
           this.setState({
               redirect: true
           })
        }
    }
    render() {
        if (this.state.redirect){
            return <Redirect to={`/quiz/questions`}/>
          
        }
        return (
            <div className='mapped-container' >
                <div className='new-kwizz-form' >
                    <label className='kwizz-desc kwizz-info' >New Kwizz Title</label>
                    <input className='title-input' onChange={this.handleInput} type='text'/>
                    <label className='kwizz-desc kwizz-info'>Description</label>
                    <textarea className='desc-input' onChange={this.handleTextarea}></textarea>
                    <div className='kwizz-info ok-go-div' >
                        <button onClick={this.createQuiz} className='btn-play  ok-go' >Ok, Go</button>
                    </div> 
                </div> 
            </div> 
        )
    }
}
export default connect(null, {editingQuiz})(New_Quiz);
// export default connect(null, {editingQuiz})(New_Quiz)
