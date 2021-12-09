import React from 'react';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik, Form, FormikProvider } from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { signIn } from "next-auth/client";
import API_CLIENT_SIDE from '../../layouts/APIConfig';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function LoginForm() {
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
    async function Login() {
      const BASE_URL = API_CLIENT_SIDE();
      const config = {
          headers: {
              'Content-Type': 'application/json', 
          }
        };
    
      const body = JSON.stringify({ email, password });
        
      try {
          const response = await axios.post(`${BASE_URL}/users/login`, body, config);
          const user = response.data;
    
          const authResponse = await signIn('credentials', { redirect: false, access: user.token.access, refresh: user.token.refresh });
          if (authResponse.ok) {
            history.push("/");
          }
    
      } catch(err) {
          const errorMessage = err.response.data.error.message;
          setLoginError(state => ({ ...state, emailError: errorMessage !== "Account not found." ? null : "Email incorrect.", 
              passError: errorMessage !== "Account not found." ? "Password incorrect." : null }));
      } 
    }

    if (email.length !== 0 && password.length !== 0) {
      Login();
    }
  }, [formData, history]);

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setFormData({ ...formData, email: values.email, password: values.password });
      
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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link onClick={event => onRouterClick(event, "/reset/password")} variant="subtitle2" >
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
