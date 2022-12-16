import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import jwt from "jsonwebtoken";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
function Questions(){
    const params = useParams();
    console.log("params",params);
    const token = localStorage.getItem("token");
    const [QuestionsList,setQuestionsList] = React.useState([]);
    useEffect(async()=>{
        var id = params.id;
     
        var decoded = jwt.decode(token);
        if(decoded.exp*1000<=Date.now()){
            this.props.history.push("/users/login");
        }else{
        var response = await axios.get(`https://secure-ravine-99917.herokuapp.com/quizquestions/getQuestions/${id}`,{
          headers:{
            'auth-token':token
          }
        });
        console.log("questionsresponse",response);
        setQuestionsList(response.data);
        }
    },[])
    return(<><h3 style={{textAlign:"center"}}>Questions ({QuestionsList.length})</h3>
    {QuestionsList.map((questions)=>{
        return(<>
        <Card>
  <Card.Header>Quote</Card.Header>
  <Card.Body>
    <blockquote className="blockquote mb-0">
      <p>
        {' '}
       {questions.question}?{' '}
      </p>
      <footer className="blockquote-footer">
        Time <cite title="Source Title">15s</cite>
      </footer>
    </blockquote>
  </Card.Body>
</Card>

        </>)
    })}
    <Button variant="primary" size="lg">
     Play
    </Button>{' '}
    </>)
}
export default Questions;