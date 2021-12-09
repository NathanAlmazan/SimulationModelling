// material
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { Box, Button, Typography, Container } from '@mui/material';
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page401() {
    const history = useRouter();
  return (
    <RootStyle>
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
        <div>
            <Typography variant="h3" paragraph>
            Unauthorize Request!
            </Typography>
        </div>
        <Typography sx={{ color: 'text.secondary' }}>
            {"Sorry, you are not allowed to view this page. If you have any concern, please ask for your manager's assistance about the matter."} 
        </Typography>

        <br />

        <Button size="large" variant="contained" onClick={() => history.push("/")}>
            Go Home
        </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}
