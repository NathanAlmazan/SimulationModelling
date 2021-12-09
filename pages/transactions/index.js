import React from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import dynamic from "next/dynamic";

//dynamic components
const TransactionList = dynamic(() => import('../../components/transactions/TransactionList'));

export default function SalesOrder(props) {
    const { currSession } = props;
    const history = useRouter();

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Transactions
                </Typography>
            </Stack>

            <TransactionList
                token={currSession.access_token}
                redirect={(event, path) => history.push(path)}
            />
            
        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant"];
    
    if (!session) {
        return {
          redirect: {
            permanent: false,
            destination: '/signin'
          }
        }
      }

      if (!ExecutivePosition.includes(session.position)) {
        return {
            redirect: {
              permanent: false,
              destination: '/401'
            }
          }
      }

      return {
          props: { currSession: session }
      }
  }

