import React, { useState } from 'react';
import axios from 'axios';
//components 
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
//icons
import CloseIcon from '@mui/icons-material/Close';
//libraries
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import dynamic from "next/dynamic";

//dynamic imports
const OrderSummary = dynamic(() => import('../../../components/_orders/payment/OrderSummary'));
const PaymentForm = dynamic(() => import('../../../components/_orders/payment/PaymentForm'));
const PaymentHistory = dynamic(() => import('../../../components/_orders/payment/PaymentHistory'));
const CustomerDialog = dynamic(() => import('../../../components/_orders/create/CustomerDialog'));
const SuccessDialog = dynamic(() => import('../../../components/_orders/payment/SuccessDialog'));
const ErrorDialog = dynamic(() => import('../../../components/_orders/create/ErrorDialog'));

export default function AddPayment(props) {
    const { currUser, currOrder, salesAgents } = props;
    const history = useRouter();
    const [openAgent, setOpenAgent] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [paidAmount, setPaidAmount] = useState("");
    const [errorDialog, setErrorDialog] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(null);
    const [receipt, setReceipt] = useState(false);

    const ExecutivePosition = ["President", "Vice President", "Manager"];

    const handleAmountBlur = (event) => {
        const amount = parseFloat(event.target.value);
        if (amount > currOrder.order_balance) {
            const change = amount - currOrder.order_balance;
            setErrorDialog(`Alert: Customer have ₱ ${change.toFixed(2)} change.`);
        }
    }

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `JWT ${currUser.access_token}`,
            }
          };

        const transaction = {
            employee_id: selectedAgent !== null ? selectedAgent.id : currOrder.employee.id, 
            account_id: currUser.userId,
            order_id: currOrder.id,
            amount_paid: parseFloat(paidAmount)
        }

        const body = JSON.stringify({ transaction: transaction });
  
        console.log(body);
        try {
            const response = await axios.post(`${baseURL}/sales/add-payment`, body, config);
            const data = response.data.data;

            setOpenSuccess(data.order_balance);

        } catch (err) {
            const errorMessage = err.response.data.error;
            setErrorDialog(`Server Error: ${errorMessage}`);
        }
          
    }

    const handleLeavePage = () => {
        if (receipt === false) {
            const baseURL = API_CLIENT_SIDE();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + currUser.access_token,
                }
            };
            axios.get(`${baseURL}/sales/generate-receipt/${currOrder.id}`, config);
        }
        history.back();
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
            setReceipt(true);

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
                    Order Payment
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => history.back()}
                    startIcon={<CloseIcon />}
                    >
                    Cancel
                </Button>
            </Stack>

            <Stack direction="column" spacing={3}>
                <Grid container direction="row" spacing={3} justifyContent="space-between">
                    <Grid item xs={12} sm={7} md={8}>
                        <PaymentForm
                            orderId={currOrder.id}
                            customer={currOrder.customer}
                            agent={currOrder.employee}
                            setOpenAgent={value => setOpenAgent(value)}
                            selectedAgent={selectedAgent}
                            amount={paidAmount}
                            setAmount={event => setPaidAmount(event.target.value)}
                            amountBlur={event => handleAmountBlur(event)}
                            submit={event => handlePaymentSubmit(event)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5} md={4}>
                        <Stack direction="column" spacing={3}>
                            <OrderSummary variant="balance" value={currOrder.order_balance} />
                            <OrderSummary variant="daysLeft" value={currOrder.days_left} />
                        </Stack>
                    </Grid>
                </Grid>

                <PaymentHistory 
                    transactions={currOrder.transactions} 
                    balance={currOrder.order_balance}
                    amountDue={currOrder.amount_due}
                    profile={false}
                    position={ExecutivePosition.includes(currUser.position)}
                />
            </Stack>

            <CustomerDialog 
                open={openAgent} 
                setOpen={value => setOpenAgent(value)} 
                selected={selectedAgent} 
                setSelected={value => setSelectedAgent(value)} 
                customers={salesAgents} 
                agent={true} 
            />

        {
            errorDialog !== null && (
              <ErrorDialog 
                open={errorDialog} 
                setOpen={value => setErrorDialog(value)} 
              />
            )
        }

        {
            openSuccess !== null && (
                <SuccessDialog 
                    open={openSuccess}
                    setOpen={value => setOpenSuccess(value)}
                    leavePage={handleLeavePage}
                    generateReceipt={() => handleGenerateReceipt()}
                /> 
            )
        }

        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const orderId = parseInt(ctx.params.orderId);
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

    if (!orderId || isNaN(orderId)) {
        return {
            notFound: true
        }
    }

    try {
        const response = await axios({
            url: `${process.env.API_BASE_URL}/sales/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currSession.access_token
            },
            data: {
              query: `
                query GetOrderById ($orderId: Int!) {
                    searchOrder (id: $orderId) {
                        id
                        customer {
                            id
                            full_name
                        }
                        employee {
                            id
                            full_name
                        }
                        days_left
                        amount_due
                        order_balance
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

        const response_2 = await axios({
            url: `${process.env.API_BASE_URL}/users/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currSession.access_token,
            },
            data: {
              query: `
                query ShowAllAgents {
                  allAgents {
                      id
                      full_name
                      email
                  }
                }
              `,
            }
        });

        const currOrder = response.data.data;
        const allAgents = response_2.data.data;

        if (!currOrder.searchOrder || !allAgents.allAgents) {
            return {
                notFound: true
            }
        }
        else {
            return {
                props: { 
                    currUser: currSession,
                    currOrder: currOrder.searchOrder,
                    salesAgents: allAgents.allAgents
                }
            }
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

