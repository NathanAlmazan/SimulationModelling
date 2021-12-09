import React from 'react';
import { useRouter } from 'next/router';
// material
import { styled } from '@mui/material/styles';
import { Stack, Link, Container, Typography } from '@mui/material';
// components
import dynamic from "next/dynamic";

const ResetPasswordForm = dynamic(() => import("../../../components/authentication/ResetPasswordForm"));

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

export default function ResetPassword(props) {
    const { accountId } = props;
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
              Reset Password 
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>A generated code was sent to your email.</Typography>
          </Stack>

          <ResetPasswordForm accountId={accountId} />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

export async function getServerSideProps(ctx) {
    const accountId = parseInt(ctx.params.accountId);

    if (!accountId || isNaN(accountId)) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            accountId: accountId
        }
    }
}

