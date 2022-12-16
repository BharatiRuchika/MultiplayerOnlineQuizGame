import { BrowserRouter, Link, Redirect, Route } from "react-router-dom";
import QuizComponent from "./components/Host/QuizComponent";
import QuestionsComponent from "./components/Host/QuestionsComponent";
import CreateQuizComponent from "./components/Host/CreateQuizComponent";
import AddAnswersComponent2 from "./components/Host/AddAnswersComponent2";
import New_Question from "./components/Host/New_Question";
import Edit_Question from "./components/Host/Edit_Question";
import New_Quiz from './components/Host/New_Quiz';
import GameComponent from "./components/Game/Game";
import Player from "./components/Game/Player";
import Landing from './components/Landing/Landing';
import Home from './components/Home/Home';
import SignUp from "./components/Home/Signup";
import Login from "./components/Home/Login";
function PrivateRoute({ path, component: Comp }) {
  console.log(localStorage.getItem("token"));
  // console.log(isLoggedIn);
  return (<Route exact path={path} render={(props) => {
    const isLoggedIn = localStorage.getItem("token");
    return isLoggedIn ? <Comp {...props} /> : <Redirect to={"/users/login"}></Redirect>
  }} />)
}
function App() {
  return (
    
    <BrowserRouter>
      <Route path='/' exact component={Landing} />
      <PrivateRoute exact path="/host/:userId" component={QuizComponent} />
      <PrivateRoute exact path="/questions/:id" component={QuestionsComponent} />
      <PrivateRoute exact path="/createQuiz" component={CreateQuizComponent} />

      <PrivateRoute exact path="/game/:id" component={GameComponent} />
      <PrivateRoute exact path="/quiz/questions" component={AddAnswersComponent2} />
      <PrivateRoute exact path='/host/newquestion/:id/:userId' component={New_Question} />
      <PrivateRoute exact path='/host/editquestion/:id/:userId' component={Edit_Question} />
      <Route exact path='/player' component={Player} />
      <Route exact path='/home' component={Home} />
      <Route exact path="/users/signup" component={SignUp} />
      <Route exact path="/users/login" component={Login} />
      <PrivateRoute exact path="/users/newQuiz/:id" component={New_Quiz} />

    </BrowserRouter>
  );
}

export default App;
