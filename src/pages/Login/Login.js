import React, { useState } from 'react';
import Field from './Field';
import styles from './Login.module.css';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup, signin } from '../../actions/auth';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createProfile } from '../../actions/profile';
import { useSnackbar } from 'react-simple-snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  profilePicture: '',
  bio: '',
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar();

  const [loading, setLoading] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, openSnackbar, setLoading, navigate));
    } else {
      dispatch(signin(formData, openSnackbar, setLoading, navigate));
    }
    setLoading(true);
  };

  const switchMode = () => {
    setIsSignup((prevState) => !prevState);
  };

  const googleSuccess = async (res) => {
    const token = res?.credential;
    const result = jwt_decode(token);

    dispatch(
      createProfile({
        name: result?.name,
        email: result?.email,
        userId: result?.sub,
        phoneNumber: '',
        businessName: '',
        contactAddress: '',
        logo: result?.picture,
        website: '',
      })
    );

    try {
      dispatch({ type: 'AUTH', data: { result, token } });
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const googleError = (error) => {
    console.log(error);
    console.log('Google Sign In was unsuccessful. Try again later');
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={styles.paper} elevation={2}>
        <Avatar className={styles.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          {isSignup ? 'Sign up' : 'Sign in'}
        </Typography>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Field
                  name='firstName'
                  label='First Name'
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Field
                  name='lastName'
                  label='Last Name'
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Field
              name='email'
              label='Email Address'
              handleChange={handleChange}
              type='email'
            />
            <Field
              name='password'
              label='Password'
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Field
                name='confirmPassword'
                label='Repeat Password'
                handleChange={handleChange}
                type='password'
              />
            )}
          </Grid>

          {loading ? (
            <CircularProgress />
          ) : (
            <button className={styles.loginBtn}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          )}

          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            onSuccess={googleSuccess}
            onError={googleError}
            shape='pill'
            size='large'
            theme='filled_blue'
            width='320'
            text={isSignup ? 'signup_with' : 'signin_with'}
          />

          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button
                onClick={switchMode}
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                }}>
                {isSignup
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
          <Link to='/forgot' style={{ textDecoration: 'none' }}>
            <p
              style={{
                textAlign: 'center',
                color: '#1d7dd6',
                marginTop: '10px',
              }}>
              Forgotten Password?
            </p>
          </Link>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
