import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import jwt from "jsonwebtoken";
import { Redirect } from 'react-router-dom';
import './Host-New-Question.css';
import './Host-Question.css'
import './Host.css';
export default class Edit_Question extends Component {
    constructor() {
        super();
        this.state = {
            quizId: 0,
            id: 0,
            question: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            correctAnswer: ''
        }
       
    }
    componentDidMount() {
        const token = localStorage.getItem("token");
            this.getQuestion();
        }
    async getQuestion() {
        const token = localStorage.getItem("token");
        var response = await axios.get(`https://secure-ravine-99917.herokuapp.com/quizquestions/getQuestion/${this.props.match.params.id}`, {
            headers: {
                'auth-token': token
            }
        })
        console.log("response", response.data[0])
        let question = response.data[0];
        this.setState({
            quizId: question.quizId,
            id: question._id,
            question: question.question,
            answer1: question.answer1,
            answer2: question.answer2,
            answer3: question.answer3,
            answer4: question.answer4,
            correctAnswer: question.correctAnswer,
            redirect: false
        })

    }
    async updateQuestion() {
      
        let { question, answer1, answer2, answer3, answer4, correctAnswer, id, quizId } = this.state;
        if (question && answer1 && answer2 && answer3 && answer4 && correctAnswer && id) {
            console.log(`id is ${id}`);
            console.log(`quizId is ${quizId}`);
            const token = localStorage.getItem("token");
            // var decoded = jwt.decode(token);
            // if (decoded.exp * 1000 <= Date.now()) {
            //     this.props.history.push("/users/login");
            // } else {
                var response = await axios.put(`https://secure-ravine-99917.herokuapp.com/quizquestions/updateQuestion/${quizId}/${id}`, { question, answer1, answer2, answer3, answer4, correctAnswer }, {
                    headers: {
                        'auth-token': token
                    }
                });
                console.log("response", response);
                if (response.status === 200) {
                    this.setState({
                        redirect: true
                    })
                } else {
                    alert('Something went wrong :(')
                }
            // }
        } else {
            alert('All fields must be completed')
        }
    }
    render() {
        if (this.state.redirect) {
            var userId = this.props.match.params.userId;
            return <Redirect to={`/quiz/questions`} />
        }
        return (
            // Used a bunch of arrow functions here instead of binding at top - Nate
            <div className='mapped-container'>
                <Link to='/host/questions' className='btn-link'>
                    go back
                </Link>
                <div className='new-q'>
                    <label>Question</label>
                    <input value={this.state.question} onChange={(e) => this.setState({ question: e.target.value })} />
                </div>
                <br />
                <div className='new-q'>
                    <label>Answer1</label>
                    <input value={this.state.answer1} onChange={(e) => this.setState({ answer1: e.target.value })} />
                </div>
                <br />
                <div className='new-q'>
                    <label>Answer2</label>
                    <input value={this.state.answer2} onChange={(e) => this.setState({ answer2: e.target.value })} />
                </div>
                <br />
                <div className='new-q'>
                    <label>Answer3</label>
                    <input value={this.state.answer3} onChange={(e) => this.setState({ answer3: e.target.value })} />
                </div>
                <br />
                <div className='new-q'>
                    <label>Answer4</label>
                    <input value={this.state.answer4} onChange={(e) => this.setState({ answer4: e.target.value })} />
                </div>
                <br />
                <div className='new-q'>
                    <label>Correct Answer</label>
                    <input type='number' min='1' max='4' value={this.state.correctAnswer} onChange={(e) => this.setState({ correctAnswer: e.target.value })} />
                    <button onClick={() => this.updateQuestion()}>Update</button>
                </div>

            </div>
        )
    }
}