import React,{useEffect,useState} from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import { styled } from '@mui/material/styles';
import axios from "axios";
import {Link,useParams} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
// import { styled } from '@mui/material/styles';
import { useHistory, } from "react-router-dom";
import {connect} from 'react-redux';
// import New_Quiz from "./New_Quiz";
import AddAnswersComponent2 from "./AddAnswersComponent2";
// import {editingQuiz,selectedQuiz} from './Reducer';
import {selectedQuiz, editingQuiz} from '../../Reducer/Reducer';
// import {Redirect}from "react-router-dom"
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
import './Host.css';
import './Host-Question.css';
import Kwizz from '../../Assets/Kwizz.svg';
import jwt from "jsonwebtoken";
function QuizComponent(props){
    const { userId } = useParams();
    console.log("userId",userId);
    var history = useHistory();
    const token = localStorage.getItem("token");
    const [quiz,setQuiz] = useState({
       quizList:[],
       redirect:false,
    //    newQuiz:false
    });
    useEffect(()=>{
        console.log("im in quiz component");
        console.log("myprops",props);
        // var decoded = jwt.decode(token);
        // if(decoded.exp*1000<=Date.now()){
        //     this.props.history.push("/users/login");
        // }else{
            getQuizzes();
        // }
    },[])
    const getQuizzes=async()=>{
        // console.log("user_id",userId);
        console.log("token",token);
        var response = await axios.get(`http://localhost:3001/quiz/getQuizzes`,{
            headers:{
                'auth-token':token
            }
            });
        console.log("quizData",response.data)
        setQuiz({...quiz,quizList:response.data})
    }
    // const handleClick = async(id)=>{
    //     console.log("im here");
    //     console.log("id",id);
    //     history.push(`/questions/${id}`);
    // }
    // const createQuiz = async()=>{
    //     history.push(`/createQuiz`);
    // }
    const setRedirect = async(e)=>{
        var response = await axios.get(`http://localhost:3001/quizquestions/getQuestions/${e._id}`,{
            headers:{
              'auth-token':token
            }
          });
          console.log("response",response);
          if(response.data.length==0){
              alert("please add atleast one question in quiz");
          }else{
            console.log("setRedirect");
            console.log("props",props);
            props.selectedQuiz(e);
            setQuiz({...quiz,redirect: true})
          }
       
    }
    // const setNewQuiz = ()=>{
    //     console.log("setnewQuiz");
    //     setQuiz({...quiz,newQuiz: true})
    // }
    const setDone = ()=>{
        console.log("im here");
    }
    const deleteQuiz = async(id)=>{
        console.log("deleteQuiz");
        console.log("id",id)
        // var decoded = jwt.decode(token);
        // if(decoded.exp*1000<=Date.now()){
        //     props.history.push("/users/login");
        // }else{
       var res =  await axios.delete(`http://localhost:3001/deleteQuiz/${id}`,{
           headers:{
               'auth-token':token
           }
       })
            if (res.status === 200){
                getQuizzes();
            } else{
                alert('Something went wrong :(')
            }
    }
   
   
  
    if (quiz.redirect){
        return <Redirect to={`/game/${userId}`}/>
     }
   
     let quizzes = quiz.quizList;
     console.log("quizzes",quizzes)
     let mappedQuizzes=quizzes.map(quiz => {
        return (
            <div key={quiz._id} className='kwizz-container'>
        <h1 className='kwizz-info kwizz-title'>{quiz.quizName}</h1>
        <p className='kwizz-info kwizz-desc'>{quiz.quizDescription}</p>
            <div className='btn-container' >
                <button onClick={() => setRedirect(quiz)} className='btn-play'>Play</button>
                <button onClick={() =>  deleteQuiz(quiz._id)} className='btn-play' >Delete</button>
            <Link to={`/quiz/questions`}>
            <button onClick={()=> props.editingQuiz(quiz)} className='btn-play' >Edit</button>
            </Link>
            </div> 
        </div>)
     })
    return (<>
     
    
                            
    <div className='mapped-container' >
    <div className='btn-done-div'>
                                <Link to='/users/login'>
                                    <button onClick={()=>{
                                        localStorage.removeItem("token")
                                    }}className='btn-play btn-done' >Logout</button>
                                </Link>
                            </div>
        <div className='host-logo-container'>
            <img src={Kwizz} alt='kwizz logo' className='logo'/>
        </div> 
        <Link to={`/users/newQuiz/${userId}`}>
        <div className='newKwizz'>
       
            <button className='btn-new'>New Kwizz!</button>
           
        </div> 
        </Link>
        <div className='mapped-Kwizzes-container' >
        {mappedQuizzes}
        </div> 
    </div> 
)

   

</>)
     
}
// function mapStateToProps(state) {
//     return {
//         quizToEdit: state.quizToEdit
//     }
// }
export default connect(null, {selectedQuiz, editingQuiz})(QuizComponent);

// export default connect(mapStateToProps, { selectedQuiz,editingQuiz })(QuizComponent)
// export default QuizComponent;