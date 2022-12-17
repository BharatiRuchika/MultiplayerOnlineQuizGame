import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import validator from 'validator'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

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
export default function SignUp() {
  const history = useHistory();
  const [flag,setFlag] = React.useState(false);
  const [state,setState] = React.useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    cpassword:"",
    errors:{
      fname:"",
      lname:"",
      email:"",
      password:"",
      cpassword:"",
      signuperror:false
    }
  })
  const handleChange = async({target:{name,value}})=>{
    console.log("handlechange called");
console.log("value",value);
    let errors = state.errors;
    errors.signuperror = false;
    switch(name){
      case "firstName":{
        if(value.length==0){
          errors.fname = "firstname cant be empty";
        }else
        if(value.length<5){
          errors.fname = 'firstname should be atleast 5 charaters long';
        }else{
          errors.fname = "";
        }
       
        break;
      }
      case "lastName":{ 
        if(value.length==0){
        errors.lname = "lastname  cant be empty";
      }else
      if(value.length<5){
        errors.lname = 'lastname  should be atleast 5 charaters long';
      }else{
        errors.lname = "";
      }
        
        break;
      }
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
        }else
        errors.password = validator.isStrongPassword(value, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })?'':"password is weak";
     
        break;
      }
      case "cpassword":{
        console.log(state.password);
        console.log(state.cpassword);
        var password = state.password;
        var cpassword = state.cpassword;
        if(value.length==0){
          errors.cpassword = "password cant be empty";
        }else
        if(password==value){
          errors.cpassword = '';
          
        }else{
          errors.cpassword = "password and confirm password are not equal"
        }
        
        break;
      }
    }
    console.log("errors",errors);
    setState({...state,[name]:value,errors:errors});
  }
  const handleSubmit = async(event) => {
    console.log("handlesubmit called");
    event.preventDefault();
    let errors = state.errors;
    console.log("errors",errors);
    let {fname,lname,email,password,cpassword} = errors;
    // let {fname,lname,email,password,cpassword} = state;
    if(fname!=""||lname!=""||email!=""||password!=""||cpassword!=""||state.fname==""||state.lname==""||state.email==""||state.password==""||state.cpassword==""){
      console.log("im here");
      errors.signuperror = true;
      setState({...state,errors:errors});
    }else{
      // errors.signuperror = false;
      // setState({...state,errors:errors});
    // if(e_fname==""&&e_lname==""&&e_email==""&&e_password==""&&e_cpassword=="")
    // {
    //   errors.signuperror = false;
    //   setState({...state,errors:errors});
    // }
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const fname1 = data.get('firstName');
    const lname1 = data.get('lastName');
    const email1 = data.get('email');
    const password1 = data.get('password');
  var response = await axios.post("http://localhost:3001/users/addUser",{fname:fname1,lname:lname1,email:email1,password:password1});
      console.log("response",response.data);
     if(response.data =="user already exist"){ 
       setFlag(true);
     }else{
       var id = response.data._id;
   if(response.status==200 ){
      history.push(`/host/${id}`);
   }
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
           {
      state.errors.signuperror?<h3>fill all information correctly</h3>:""
    }
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                />
                  <span style={{color:'red'}}>{state.errors.fname}</span>
              </Grid>
            
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleChange}
                />
                <span style={{color:'red'}}>{state.errors.lname}</span>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
                 <span style={{color:'red'}}>{state.errors.email}</span>
              </Grid>
             
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
                 <span style={{color:'red'}}>{state.errors.password}</span>
              </Grid>
            
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="cpassword"
                  label="Confirm Password"
                  type="password"
                  id="cpassword"
                  autoComplete="new-password1"
                  onChange={handleChange}
                />
                <span style={{color:'red'}}>{state.errors.cpassword}</span>
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {
     flag?<div style={{color:'red',fontSize:'20px'}}>User already register</div>:<></>}
            <Grid container justifyContent="flex-end">
              <Grid item>
              <Link to='/users/login' className='btn-link'>
                <b style={{cursor:'alias',color:'blue'}}>   Already have an account? Sign in</b>
                 </Link>

                {/* <Link to="/users/login" variant="body2">
                  Already have an account? Sign in
                </Link> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
