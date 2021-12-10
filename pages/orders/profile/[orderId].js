import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArchiveIcon from '@mui/icons-material/Archive';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from "next/dynamic";
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

const OrderInfo = dynamic(() => import('../../../components/_orders/profile/OrderInfo'));
const PointOfSale = dynamic(() => import('../../../components/_orders/profile/PointOfSale'));
const ErrorDialog = dynamic(() => import('../../../components/_orders/create/ErrorDialog'));
const PaymentHistory = dynamic(() => import('../../../components/_orders/payment/PaymentHistory'), { ssr: false});

export default function UpdateOrder(props) {
    const { currOrder, currUser } = props;
    const [orderProducts, setOrderProducts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [errorDialog, setErrorDialog] = useState(null);
    const history = useRouter();
    const [orderForm, setOrderForm] = useState({
        id: "",
        customerName: "",
        agentName: "",
        order_date: "",
        terms: "",
        due_date: "",
        payment_type: "",
        vat: "",
        discount: "",
        totalPrice: "",
        amount_due: ""
    });
    const matches = useMediaQuery('(max-width:500px)');

    const ExecutivePosition = ["President", "Vice President", "Manager"];
    const AllowedPosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];

    useEffect(() => {

        const orderDate = new Date(currOrder.order_date);
        const dueDate = new Date(currOrder.due_date);

        const difference = Math.abs(dueDate.valueOf() - orderDate.valueOf());
        const orderTerms = difference/(1000 * 3600 * 24);

        setOrderForm(orderData => ({ ...orderData, 
            id: currOrder.id,
            customerName: currOrder.customer.full_name,
            agentName: currOrder.employee.full_name,
            order_date: currOrder.order_date,
            due_date: currOrder.due_date,
            payment_type: currOrder.payment_type,
            terms: orderTerms,
            vat: currOrder.vat,
            discount: currOrder.discount,
            totalPrice: currOrder.total_price,
            amount_due: currOrder.amount_due
        }));

        setOrderProducts(state => currOrder.products);
        setPayments(state => currOrder.transactions);
    }, [currOrder]);

    const handleEdit = () => {
        if (!currOrder.delivered) {
            history.push(`/orders/edit/${currOrder.id}`)
        } else {
            setErrorDialog("Alert: You cannot edit this order because it is already delivered.");
        }
    }

    const cancelOrder = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `JWT ${currUser.access_token}`,
            }
          };
        if (!currOrder.delivered && currOrder.transactions.length === 0) {
            try {
                await axios.get(`${baseURL}/sales/hold-order/${orderForm.id}`, config);
                history.reload();
          
              } catch (err) {
                const errResponse = err.response.data !== undefined ? err.response.data.error : null;
                if (errResponse !== null) {
                  setErrorDialog("Error: " + errResponse);
                } else {
                  setErrorDialog(`Server Error: Server is probably down.`);
                }
              }
        } else {
            setErrorDialog("Alert: You cannot edit this order because it is already delivered or already received payment.");
        }
      }

      const restoreOrder = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `JWT ${currUser.access_token}`,
            }
          };
        if (!currOrder.delivered && currOrder.transactions.length === 0) {
            try {
                await axios.get(`${baseURL}/sales/restore-order/${orderForm.id}`, config);
                history.reload();
          
              } catch (err) {
                const errResponse = err.response.data !== undefined ? err.response.data.error : null;
                if (errResponse !== null) {
                  setErrorDialog("Error: " + errResponse);
                } else {
                  setErrorDialog(`Server Error: Server is probably down.`);
                }
              }
        } else {
            setErrorDialog("Alert: You cannot edit this order because it is already delivered or already received payment.");
        }
      }

    const handleGetInvoice = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
            }
        };

        try {
            const response = await axios.get(`${baseURL}/sales/get-invoice/${currOrder.id}`, config);
            const orderInvoice = response.data.data;

            window.open(orderInvoice);

        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                }
                else if (err.response.data.error === "No PDF Invoice generated yet.") {
                    handleGenerateInvoice();
                } else {
                    setErrorDialog("Error: " + err.response.data.error);
                }
            } else {
                setErrorDialog("Error: The server is probably offline.");
            }
        }
    } 

    const handleGetReceipt = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
            }
        };

        try {
            const response = await axios.get(`${baseURL}/sales/get-receipt/${currOrder.id}`, config);
            const orderInvoice = response.data.data;

            window.open(orderInvoice);

        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                }
                else if (err.response.data.error === "No PDF Receipt generated yet.") {
                    handleGenerateReceipt();
                } else {
                    setErrorDialog("Error: " + err.response.data.error);
                }
            } else {
                setErrorDialog("Error: The server is probably offline.");
            }
        }
    } 

    const handleGenerateInvoice = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
            }
        };

        try {
            const response = await axios.get(`${baseURL}/sales/generate-invoice/${currOrder.id}`, config);
            const orderInvoice = response.data.data;

            window.open(orderInvoice);

        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    setErrorDialog("Error: " + err.response.data.error);
                }
               
            } else {
                setErrorDialog("Error: The server is probably offline.");
            }
        }
    }

    const handleGenerateReceipt = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
            }
        };

        try {
            const response = await axios.get(`${baseURL}/sales/generate-receipt/${currOrder.id}`, config);
            const orderInvoice = response.data.data;

            window.open(orderInvoice);

        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    setErrorDialog("Error: " + err.response.data.error);
                }
               
            } else {
                setErrorDialog("Error: The server is probably offline.");
            }
        }
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Order Profile
                </Typography>
                {!matches ? (
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    {AllowedPosition.includes(currUser.position) && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>  handleEdit()}
                            startIcon={<EditIcon />}
                        >
                            Edit
                        </Button>
                    )}
                    {ExecutivePosition.includes(currUser.position) && currOrder.is_active === true && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => cancelOrder()}
                            startIcon={<ArchiveIcon />}
                        >
                            Cancel
                        </Button>
                    )}
                    {ExecutivePosition.includes(currUser.position) && currOrder.is_active !== true && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => restoreOrder()}
                            startIcon={<UnarchiveIcon />}
                        >
                            Restore
                        </Button>
                    )}
                    </Stack>
                ) : (
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    {AllowedPosition.includes(currUser.position) && (
                        <IconButton
                            variant="contained"
                            color="secondary"
                            onClick={() =>  handleEdit()}
                        >
                           <EditIcon />
                        </IconButton>
                    )}
                    {ExecutivePosition.includes(currUser.position) && currOrder.is_active === true && (
                        <IconButton
                            variant="contained"
                            color="error"
                            onClick={() => cancelOrder()}
                        >
                            <ArchiveIcon />
                        </IconButton>
                    )}
                    {ExecutivePosition.includes(currUser.position) && currOrder.is_active !== true && (
                        <IconButton
                            variant="contained"
                            color="secondary"
                            onClick={() => restoreOrder()}
                        >
                            <UnarchiveIcon />
                        </IconButton>
                    )}
                    </Stack>
                )}
            </Stack>

            <Stack direction="column" spacing={3}>
                <Card sx={{ padding: 5, width: '100%' }}>
                    <OrderInfo
                        orderInfo={orderForm}
                     />
                </Card>

                <Card sx={{ padding: 5, width: '100%' }}>
                  <PointOfSale
                    orderProducts={orderProducts}
                    orderInfo={orderForm}
                  />
                </Card>

                
                <PaymentHistory 
                    transactions={payments}
                    amountDue={currOrder.amount_due}
                    balance={currOrder.order_balance}
                    token={currUser.access_token}
                    reload={() => history.reload()}
                    profile={true}
                    position={ExecutivePosition.includes(currUser.position)}
                />

                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleGetInvoice()}
                        sx={{ height: 50, fontSize: '16px' }}
                    >
                        Generate Invoice
                    </Button>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleGetReceipt()}
                        sx={{ height: 50, fontSize: '16px' }}
                    >
                        Generate Receipt
                    </Button>
                </Stack>

                {currOrder.order_balance > 0 && (
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => history.push(`/orders/payment/${currOrder.id}`)}
                        sx={{ height: 50, fontSize: '16px' }}
                    >
                        Add Payment
                    </Button>
                )}
                
            </Stack>

          {
            errorDialog !== null && (
              <ErrorDialog 
                open={errorDialog} 
                setOpen={value => setErrorDialog(value)} 
              />
            )
          }

        </Container>
    )
}


export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const orderId = parseInt(ctx.params.orderId);

    if (!currSession) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin'
        }
      }
    }

    try {

      const response = await axios({
        url: `${process.env.API_BASE_URL}/sales/graphql`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + currSession.access_token,
        },
        data: {
          query: `
            query GeyOrderByID ($orderId: Int!) {
                searchOrder (id: $orderId) {
                    id
                    employee {
                        id
                        full_name
                    }
                    customer {
                        id
                        full_name
                    }
                    payment_type
                    vat
                    discount 
                    order_date
                    due_date
                    total_price
                    delivered
                    amount_due
                    order_balance
                    is_active
                    products {
                        product {
                            id
                            name
                            price
                        }
                        quantity
                        total_price
                    }
                    transactions {
                        id
                        employee {
                            full_name
                        }
                        amount_paid
                        payment_date
                    }
                }
            }
          `,
          variables: {
            orderId: orderId,
          }
        }
      });

      const currOrder = response.data.data;

      return {
        props: {
            currUser: currSession,
            currOrder: currOrder.searchOrder }
      }

    } catch (err) {
      if (err.response.data.error === "Invalid Token") {
        return {
          redirect: {
            permanent: false,
            destination: '/signin'
          }
        }
      } else return {
        notFound: true,
      }
    }
  }

