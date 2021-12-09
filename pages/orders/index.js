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
const OrderListTable = dynamic(() => import('../../components/_orders/dashboard/OrderListTable'));

export default function SalesOrder(props) {
    const { currUser } = props;
    const history = useRouter();


    const onRedirect = (event, path) => {
      history.push(path);
    }

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Sales Orders
                </Typography>
                <Button
                    variant="contained"
                    onClick={e => onRedirect(e, "/orders/create")}
                    startIcon={<AddIcon />}
                >
                    Create Order
                </Button>
            </Stack>

            <OrderListTable
                token={currUser.access_token}
                redirect={(event, path) => onRedirect(event, path)}
                position={currUser.position}
            />

        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const Personnel = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];

    if (!currSession) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin'
        }
      }
    }

    if (Personnel.includes(currSession.position)) {
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

