import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";
import CloseIcon from '@mui/icons-material/Close';
import { getSession } from 'next-auth/client';
import axios from 'axios';

const UpdateForm = dynamic(() => import("../../../components/_supplier/update/UpdateForm"));

export default function UpdateSupplier(props) {
    const { supplierData, currUser } = props;
    const history = useRouter();
    const onRouterClick = (e) => {
      history.back();
    }

    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Update Supplier
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
                        supplier={supplierData}
                        account={currUser}
                    />
                </Card>
            </Container>
    )
}

export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant"];

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
      
    const supplierId = parseInt(ctx.params.supplierId);

    if (!supplierId || isNaN(supplierId)) {
        return {
            notFound: true
        };
    }

    try {
        const response = await axios({
          url: `${process.env.API_BASE_URL}/payables/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY,
          },
          data: {
            query: `
              query GetSupplier ($ID: Int!) {
                searchSupplier (supplierId: $ID) {
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
                    total_collecting
                    is_active
                }
              }
            `,
            variables: {
                ID: supplierId,
            }
          }
        });

      const supplierData = response.data.data;
      
      if (!supplierData.searchSupplier) {
          return {
              notFound: true,
          }
      }

      return {
          props: { 
                supplierData: supplierData.searchSupplier,
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
