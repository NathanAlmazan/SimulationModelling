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

export default function ResetForm() {
  const history = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState({
    emailError: null,
    passError: null
  });
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });

  const { emailError, passError } = loginError;

  useEffect(() => {
    const { email, firstName, lastName } = formData;
    async function Reset() {
      const BASE_URL = API_CLIENT_SIDE();
      const config = {
          headers: {
              'Content-Type': 'application/json', 
          }
        };
    
      const body = JSON.stringify({ email, firstName, lastName });
        
      try {
          const response = await axios.post(`${BASE_URL}/users/resetPassword`, body, config);
          const user = response.data;
    
          history.push(`/reset/confirm/${user.accountId}`);
    
      } catch(err) {
          console.log(err.response);
          const errorMessage = err.response.data.error;
          setLoginError(state => ({ ...state, emailError: errorMessage}));
      } 
    }

    if (email.length !== 0) {
        Reset();
    }
  }, [formData, history]);

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required')
  });

  

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
        setFormData({ ...formData, email: values.email, firstName: values.firstName, lastName: values.lastName });    
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
                autoComplete="firstname"
                label="First Name"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName) || Boolean(emailError !== null && emailError)}
                helperText={(touched.firstName && errors.firstName) || (emailError !== null && emailError)}
            />
            <TextField
                fullWidth
                autoComplete="lastname"
                label="Last Name"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName) || Boolean(emailError !== null && emailError)}
                helperText={(touched.lastName && errors.lastName) || (emailError !== null && emailError)}
            />
            <TextField
                fullWidth
                autoComplete="username"
                type="email"
                label="Email address"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email) || Boolean(emailError !== null && emailError)}
                helperText={(touched.email && errors.email) || (emailError !== null && emailError)}
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
          Get Reset Code
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
