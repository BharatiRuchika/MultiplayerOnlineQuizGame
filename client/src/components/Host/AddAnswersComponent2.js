import React, { Component } from 'react';
import axios from 'axios';
import { Link,Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { editingQuiz } from '../../Reducer/Reducer';
import jwt from "jsonwebtoken";
import './Host-Question.css';
import './Host.css';
import QuizComponent from './QuizComponent';
// import {useParams} from 'react-router-dom';
class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            quiz: {},
            newName: '',
            newInfo: '',
            userId:'',
            toggle: false,
            redirect:false
        }
        this.setDone = this.setDone.bind(this);
      
    }
    componentDidMount() {
        // const { userId } = useParams();
        // var history = useHistory();
        console.log("Addanswercomponent2 called");
        // var userId = this.props.match.params.id;
        // console.log("id",userId);
        console.log("props", this.props);
        this.setState({
            quiz: this.props.quizToEdit,
            newName:this.props.quizToEdit.quizName,
            newInfo:this.props.quizToEdit.quizDescription,
            userId:this.props.quizToEdit.userId
        })
        console.log("quiz", this.state.quiz);
        const token = localStorage.getItem("token");
        // var decoded = jwt.decode(token);
      
        this.getQuestions();
        
    }

    async getQuestions() {
        const token = localStorage.getItem("token");
       console.log(`id is ${this.props.quizToEdit._id}`)
       var response = await axios.get(`http://localhost:3001/quizquestions/getQuestions/${this.props.quizToEdit._id}`,{
           headers:{
               'auth-token':token
           }
       })
            console.log("data", response.data);
            this.setState({
                questions: response.data,
            })
        }

    async deleteQuestion(id) {
        const token = localStorage.getItem("token");
       
        var decoded = jwt.decode(token);
        if(decoded.exp*1000<=Date.now()){
            this.props.history.push("/users/login");
        }else{
            var response =  await axios.delete(`http://localhost:3001/quizquestions/deleteQuestion/${id}`,{
           headers:{
               'auth-token':token
           }
       })
        this.getQuestions();
        }
    }

    displayEdit() {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    async updateQuiz() {
        

        let { newName, newInfo, quiz } = this.state;
        console.log("update quiz called");
        // let { quiz } = this.state;
        console.log("quiz",quiz);
        this.setState({
            toggle: !this.state.toggle
        })
      
        if (newName && newInfo) {
            var id = quiz._id;
            const token = localStorage.getItem("token");
            var decoded = jwt.decode(token);
            if(decoded.exp*1000<=Date.now()){
                this.props.history.push("/users/login");
            }else{
                await axios.put(`http://localhost:3001/quiz/updateQuiz/${id}`, { quizName: newName, quizDescription: newInfo },{
                    headers:{
                        'auth-token':token
                    }
                })
                this.handleUpdatedQuiz(quiz._id)
            }
        } else {
            alert('All fields must be completed')
        }
        } 
    
    async handleUpdatedQuiz(id) {
        const token = localStorage.getItem("token");
        var decoded = jwt.decode(token);
        // if(decoded.exp*1000<=Date.now()){
        //     this.props.history.push("/users/login");
        // }else{
        var response = await axios.get(`http://localhost:3001/quiz/getQuiz/${this.props.quizToEdit._id}`,{
            headers:{
                'auth-token':token
            }
        })
        console.log("responseData",response.data);
        var responseData = response.data;
        this.props.editingQuiz(responseData[0]);
        console.log("props",this.props.quizToEdit)
        this.setState({
            quiz: this.props.quizToEdit
        })
    // }
    }
     setDone(){
        console.log("setDone called");
        this.setState({
            redirect:true
        })
    }

    render() {
        // var userId = this.props.match.params.id;
        // console.log("answercomponentuserId",userId);
        let { questions,redirect,userId } = this.state;
        console.log("userId",userId);
        console.log(this.state.redirect);
        if(redirect){
            return <Redirect to={`/host/${userId}`}/>;
        }
        if (questions) {
            var mappedQuestions = questions.map((question) => {
                return (
                    <div key={question._id} className='question-container'>
                        <h1>{question.question}</h1>
                        <ul>
                            <li>1: {question.answer1}</li>
                            <li>2: {question.answer2}</li>
                            <li>3: {question.answer3}</li>
                            <li>4: {question.answer4}</li>
                            <li>Correct: {question.correctAnswer}</li>

                        </ul>
                        <div className='btn-container-edit' >
                            <Link to={`/host/editquestion/${question._id}/${userId}`}>
                                <button className='btn-play' >Edit</button>
                            </Link>
                            <button onClick={() => this.deleteQuestion(question._id)} className='btn-play'>Delete</button>
                        </div>
                    </div>
                )
            })

        }

        return (
            <div className='mapped-container' >
                {
                    !this.state.toggle
                        ?
                        <div className='toggle-container'>
                            <div className='btn-done-div'>
                                {/* <Link to={`/host/${this.props.userId}`}> */}
                                    <button onClick={this.setDone}className='btn-play btn-done' >Done</button>
                                {/* </Link> */}
                            </div>
                            <div className='kwizz-container-edit'>
                                <h1 className='kwizz-title'>{this.state.quiz.quizName}</h1>
                                <br />
                                <p className='kwizz-info kwizz-desc'>{this.state.quiz.quizDescription}</p>
                                <div className='btn-update'>
                                    <button onClick={() => this.displayEdit()} className='btn-play'>Update</button>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='toggle-container'>
                            <div className='btn-done-div'>
                                <Link to='/host'>
                                    <button className='btn-play btn-done' >Done</button>
                                </Link>
                            </div>
                            <div className='kwizz-container-edit'>
                                {/* <h1 className='kwizz-title'>{this.state.quiz.quizName}</h1>
                        <p className='kwizz-info kwizz-desc'>{this.state.quiz.quizDescription}</p> */}
                                <input placeholder={this.state.quiz.quizName}
                                 onChange={(e) =>{
                                    console.log("e",e.target.value);
                                    this.setState({newName: e.target.value})}}
                                    className='title-input input-edit ' />
                                 <br />
                                <textarea placeholder={this.state.quiz.quizDescription} 
                                onChange={(e) => {
                                    console.log("e",e.target.value);
                                    this.setState({ newInfo: e.target.value})}} 
                                className='desc-input input-edit'></textarea>
                                <div className='btn-container-edit'>
                                    <button onClick={() => this.updateQuiz()} className='btn-play'>Save</button>
                                    <button onClick={() => this.displayEdit()} className='btn-play'>Cancel</button>
                                </div>
                            </div>
                        </div>
                }
                <div className='question-edit-wrapper' >
                    <div className='add-quesiton-div' >
                    <Link to={`/host/newquestion/${this.props.quizToEdit._id}/${userId}`} className='btn-link'>
                            <button className='btn-new' id='add-question-btn'>Add Question</button>
                        </Link>
                    </div>
                    <br /><br />
                    <div className='mapped-questions'>
                        {mappedQuestions}
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

export default connect(mapStateToProps, { editingQuiz })(Questions)