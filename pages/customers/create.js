import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import dynamic from "next/dynamic";
import CloseIcon from '@mui/icons-material/Close';

const RegisterCustomer = dynamic(() => import("../../components/_customers/create/RegisterCustomer"));

function CreateCustomer() {
    const history = useRouter();

    const onRouterClick = (e) => {
        history.back();
    }

    useEffect(() => {
        async function authenticate () {
            const session = await getSession();
            const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];
            if (!session) {
                history.push("/signin");
            }
            if (!ExecutivePosition.includes(session.position)) {
                history.push("/401");
            }
        }
       
        authenticate();
    }, [history]);

    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        New Customer
                    </Typography>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={e => onRouterClick(e)}
                        startIcon={<CloseIcon />}
                    >
                        Cancel
                    </Button>
                </Stack>

                <Card sx={{ padding: 5 }}>
                    <RegisterCustomer />
                </Card>
            </Container>
    )
}

export default CreateCustomer;
