import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import dynamic from "next/dynamic";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const UpdateForm = dynamic(() => import("../../../components/_customers/update/UpdateCustomer"));

export default function UpdateCustomer(props) {
    const { customerData, currUser } = props;
    const history = useRouter();
    
    const onRouterClick = (e) => {
      history.back();
    }

    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Update Customer
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
                    <UpdateForm
                        customer={customerData}
                        user={currUser}
                    />
                </Card>
            </Container>
    )
}

export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];

    if (!currSession) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin'
        }
      }
    }

    if (!ExecutivePosition.includes(currSession.position)) {
      return {
          redirect: {
            permanent: false,
            destination: '/401'
          }
        }
    }

    const customerId = parseInt(ctx.params.customerId);

    if (!customerId || isNaN(customerId)) {
        return {
            notFound: true
        };
    }

    try {
        const response = await axios({
          url: `${process.env.API_BASE_URL}/sales/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY,
          },
          data: {
            query: `
              query GetCustomer ($ID: Int!) {
                searchCustomer (id: $ID) {
                  id
                  first_name
                  last_name
                  contact_number
                  company_name
                  email
                  website
                  address
                  city
                  province
                }
              }
            `,
            variables: {
                ID: customerId,
            }
          }
        });

      const customerData = response.data.data;
      
      if (!customerData.searchCustomer) {
          return {
              notFound: true,
          }
      }

      return {
          props: { 
              customerData: customerData.searchCustomer,
              currUser: currSession
          }
      }

    } catch (err) {
        console.log(err)
        return {
            notFound: true
        };
    }
}  