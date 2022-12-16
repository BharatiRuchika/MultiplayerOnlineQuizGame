import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import {useHistory} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();
const validEmailRegex = 
  RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
export default function SignIn() {
  var history = useHistory();
  const [Email,setEmail] = React.useState(false);
  const [Password,setPassword] = React.useState(false);
  const [State,setState ] = React.useState({
    email:"",
    password:"",
    errors:{
      email:"",
      password:"",
      loginerror:false
    }
  })
  const handleChange = async(event)=>{
    console.log(event);
    const { name, value } = event.target;
    let errors = State.errors;
    errors.loginerror = false;
    console.log("name",name);
    console.log("value",value);
    console.log("errors",errors);
    switch(name){
      case "email":{
        if(value.length==0){
          errors.email = "email cant be empty";
        }else
        errors.email =  validEmailRegex.test(value)
        ? ''
        : 'Email is not valid!';
        break;
      }
      case "password":{
        if(value.length==0){
          errors.password = "password cant be empty";
        }else{
          errors.password = ""
        }
        break;
    }
  }
    setState({...State,[name]:value,errors:errors});
    setEmail(false);
    setPassword(false);
  }

  const handleSubmit = async(event) => {
    console.log("handlesubmit called");
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log("state",State);
    let errors = State.errors;
    console.log("errors",errors);
    let {email,password} = errors;
    if(email!=""||password!=""||State.email==""||State.password==""){
      console.log("im here");
      errors.loginerror = true;
      setState({...State,errors:errors});
    }else{
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
   
    var response = await axios.post("https://secure-ravine-99917.herokuapp.com/users/validateUser",{email:data.get("email"),password:data.get("password")});
    console.log("response",response);
  
    if(response.data.authToken){
      console.log("authtoken",response.data.authToken);
      var id = response.data.user._id;
      localStorage.setItem("token",response.data.authToken);
      history.push(`/host/${id}`);
    }
   
  }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
         
          <Box component="form" noValidate onSubmit={handleSubmit}  sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              onChange={handleChange}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <span style={{color:'red'}}>{State.errors.email}</span>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
              autoComplete="current-password"
            />
          <span style={{color:'red'}}>{State.errors.password}</span>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
           
            <Grid container>
              <Grid item xs>
               
              </Grid>
              <Grid item>
              <Link to='/users/signup' className='btn-link'>
                <b style={{cursor:'alias',color:'blue'}}>   Don't have an account? Sign Up</b>
                 </Link>

               
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
