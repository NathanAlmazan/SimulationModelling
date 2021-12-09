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

const UpdateEmployeeeForm = dynamic(() => import("../../../components/_employees/update/UpdateEmployee"));

export default function UpdateEmployee(props) {
    const { employeeData, currUser } = props;
    const history = useRouter();
      const onRouterClick = (e) => {
        history.back();
      }
    
      const ExecutivePosition = ["President", "Vice President", "Manager"];

    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Update Employee
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
                    <UpdateEmployeeeForm
                        employee={employeeData}
                        accessToken={currUser.access_token}
                        disablePosition={!ExecutivePosition.includes(currUser.position)}
                    />
                </Card>
            </Container>
    )
}

export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const ExecutivePosition = ["President", "Vice President", "Manager"];

    if (!currSession) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin'
        }
      }
    }
    
    const employeeId = parseInt(ctx.params.employeeId);

    if (!employeeId || isNaN(employeeId)) {
        return {
            notFound: true
        };
    }

    if (ExecutivePosition.includes(currSession.position) || currSession.userId === employeeId) {
      try {
          const response = await axios({
            url: `${process.env.API_BASE_URL}/users/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'KEY ' + process.env.BACKEND_KEY,
            },
            data: {
              query: `
                query GetEmployee ($ID: Int!) {
                  searchEmployee (employeeId: $ID) {
                    id
                    first_name
                    last_name
                    contact_number
                    email
                    position
                    zip_code
                    address
                    city
                    province
                  }
                }
              `,
              variables: {
                  ID: employeeId,
              }
            }
          });

        const employeeData = response.data.data;
        
        if (!employeeData.searchEmployee) {
            return {
                notFound: true,
            }
        }

        return {
            props: { 
                employeeData: employeeData.searchEmployee,
                currUser: currSession
            }
        }

      } catch (err) {
          console.log(err)
          return {
              notFound: true
          };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/401'
        }
      }
    }
}  
