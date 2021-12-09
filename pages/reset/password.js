import React from 'react';
import { useRouter } from 'next/router';
// material
import { styled } from '@mui/material/styles';
import { Stack, Link, Container, Typography } from '@mui/material';
// components
import dynamic from "next/dynamic";

const ResetForm = dynamic(() => import("../../components/authentication/ResetForm"));

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
    const history = useRouter();
    
    const onRouterClick = (e, path) => {
        history.push(path);
    }
  return (
    <RootStyle title="Login | Minimal-UI">

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Request Reset Password
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below to confirm your identity.</Typography>
          </Stack>

          <ResetForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

