import React from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import dynamic from "next/dynamic";
//icons
import AddIcon from '@mui/icons-material/Add';

//dynamic components
// const AppWeeklySales = dynamic(() => import('../../components/SalesOrder/NewOrders'));
// const AppCanceledOrders = dynamic(() => import('../../components/SalesOrder/CanceledOrders'));
// const AppPaidWeek = dynamic(() => import('../../components/SalesOrder/PaidWeek'));
// const AppDueToday = dynamic(() => import('../../components/SalesOrder/DueToday'));
const PurchasedListTable = dynamic(() => import('../../components/_payables/dashboard/PurchasedListTable'));

export default function PurchasedOrder(props) {
    const { currUser } = props;
    const history = useRouter();


    const onRedirect = (event, path) => {
      history.push(path);
    }

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Purchase Orders
                </Typography>
                <Button
                    variant="contained"
                    onClick={e => onRedirect(e, "/purchase/create")}
                    startIcon={<AddIcon />}
                >
                    Record Purchase
                </Button>
            </Stack>

            <PurchasedListTable
                token={currUser.access_token}
                redirect={(event, path) => onRedirect(event, path)}
                position={currUser.position}
            />

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

    return {
        props: { currUser: currSession }
    }
  }

