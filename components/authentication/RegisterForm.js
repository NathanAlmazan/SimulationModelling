import React from 'react';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik, Form, FormikProvider } from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import API_CLIENT_SIDE from '../../layouts/APIConfig';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const history = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState({
    emailError: null,
    passError: null
  });
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { emailError, passError } = loginError;

  useEffect(() => {
    const { email, password } = formData;
    async function Signup() {
      const BASE_URL = API_CLIENT_SIDE();
      const config = {
          headers: {
              'Content-Type': 'application/json', 
          }
        };
    
      const body = JSON.stringify({ email, password });
        
      try {
          const response = await axios.post(`${BASE_URL}/users/signup`, body, config);
          const user = response.data;
    
          history.push("/signin");
    
      } catch(err) {
          console.log(err.response);
          const errorMessage = err.response.data.error;
          setLoginError(state => ({ ...state, emailError: errorMessage}));
      } 
    }

    if (email.length !== 0 && password.length !== 0) {
      Signup();
    }
  }, [formData, history]);

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().min(9, 'Too Short!').required('Password is required')
  });

  

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
        if (values.password !== values.confirmPassword) {
            setLoginError({ ...loginError, passError: "Password does not match." });
        } else {
            setFormData({ ...formData, email: values.email, password: values.password });
            setLoginError({ ...loginError, passError: null });
        }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email) || Boolean(emailError !== null && emailError)}
            helperText={(touched.email && errors.email) || (emailError !== null && emailError)}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password) || Boolean(passError !== null && passError)}
            helperText={(touched.password && errors.password) || (passError !== null && passError)}
          />

        <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword) || Boolean(passError !== null && passError)}
            helperText={(touched.confirmPassword && errors.confirmPassword) || (passError !== null && passError)}
          />
        </Stack>

        <br/>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Signup
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
