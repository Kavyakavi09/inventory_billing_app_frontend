import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Paper, Typography, Container, Grid } from '@mui/material';
import Field from '../Login/Field';
import { useParams, useNavigate } from 'react-router-dom';

import { reset } from '../../actions/auth';

const Reset = () => {
  const [form, setForm] = useState('');
  const dispatch = useDispatch();
  const history = useNavigate();
  const { token } = useParams();
  const user = JSON.parse(localStorage.getItem('profile'));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(reset({ password: form, token: token }, history));
  };

  const handleChange = (e) => setForm(e.target.value);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  if (user) history('/dashboard');

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <Container component='main' maxWidth='xs'>
        <Paper
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px',
          }}
          variant='outlined'>
          <Typography variant='h6' gutter='5'>
            Please enter your new password
          </Typography>

          <form
            sx={{ margin: 8 }}
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Field
                name='password'
                label='Password'
                handleChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                handleShowPassword={handleShowPassword}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                sx={{ margin: '16px 0 16px' }}>
                Submit
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Reset;
