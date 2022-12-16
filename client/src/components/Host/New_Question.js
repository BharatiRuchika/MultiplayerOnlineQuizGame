import React, { Component } from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom';
import { editingQuiz } from '../../Reducer/Reducer';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Host-New-Question.css';
import jwt from "jsonwebtoken";
import './Host.css';
class New_Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            correctAnswer: '',
            redirect: false
        }
        this.addQuestion = this.addQuestion.bind(this)
    }
   async addQuestion() {
    const token = localStorage.getItem("token");
  let { question, answer1, answer2, answer3, answer4, correctAnswer } = this.state;
        if(question=="" || answer1=="" || answer2=="" ||answer3=="" || answer4=="" || correctAnswer==""){
            alert("enter all information");
        }else{
        let { id } = this.props.match.params;
        console.log("id",id);
        if (question && answer1 && answer2 && answer3 && answer4 && correctAnswer) {
        var response =  await axios.post("https://secure-ravine-99917.herokuapp.com/quizquestions/addQuestions", { question, answer1, answer2, answer3, answer4, correctAnswer,id 
        },{
            headers:{
                'auth-token':token
            }
        });
          
           console.log("response",response);
            if (response.status === 200) {
                    this.setState({
                    redirect: true
            })
            } else {
                alert('Something went wrong :(')
                }
            } else {
            alert('All fields must be completed')
        }
    }
}
    render() {
        console.log("props",this.props);
        if (this.state.redirect) {
            var userId = this.props.quizToEdit.userId;
            return <Redirect to={`/quiz/questions`} />;
        }
        return (
  <div className='background'>
            <Link to='/host/questions' className='btn-go-back'>
                go back pls :)
            </Link>
            <br/>
    <div className='new-question-wrapper'>
                <div className='new-q'>
                    <label>Question</label>
                    <input onChange={(e) => this.setState({ question: e.target.value })} />
                </div>
            
                  <div className='new-q'> 
                    <label>Answer1</label>
                        <input onChange={(e) => this.setState({ answer1: e.target.value })} height='100'/>
                </div>
                <div className='new-q'>
                    <label>Answer2</label>
                        <input onChange={(e) => this.setState({ answer2: e.target.value })} />
                </div>
                <div className='new-q'>
                    <label>Answer3</label>
                        <input onChange={(e) => this.setState({ answer3: e.target.value })} />
               </div>
                <div className='new-q'>
                    <label>Answer4</label>
                        <input onChange={(e) => this.setState({ answer4: e.target.value })} />
                </div>
                <div className='new-q'>
                    <label>Correct answer</label>
                    <input type='number' min='1' max='4' onChange={(e) => this.setState({ correctAnswer: e.target.value })} />
                </div>
                    <div className='next'>
                        <button onClick={this.addQuestion}  className='btn-new'>Next</button>
                    </div>
        </div>
     </div>   
        )
    }
}
function mapStateToProps(state) {
    return {
        quizToEdit: state.quizToEdit
    }
}
export default connect(mapStateToProps, { editingQuiz })(New_Question)