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
const PaymentForm = dynamic(() => import('../../../components/_payables/payment/paymentForm'));
const PaymentHistory = dynamic(() => import('../../../components/_payables/profile/PaymentHistory'));
const SuccessDialog = dynamic(() => import('../../../components/_payables/payment/SuccessDialog'));
const ErrorDialog = dynamic(() => import('../../../components/_orders/create/ErrorDialog'));

export default function AddPayment(props) {
    const { currUser, currPurchase } = props;
    const history = useRouter();
    const [paidAmount, setPaidAmount] = useState("");
    const [errorDialog, setErrorDialog] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(null);
    const [receipt, setReceipt] = useState(null);

    const handleAmountBlur = (event) => {
        const amount = parseFloat(event.target.value);
        if (amount > currPurchase.purchase_balance) {
            const change = amount - currPurchase.purchase_balance;
            setErrorDialog(`Alert: Payment should have ₱ ${change.toFixed(2)} change.`);
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
            account_id: currUser.userId,
            amount_paid: parseFloat(paidAmount)
        }

        const body = JSON.stringify({ paymentInfo: transaction });
  
        console.log(body);
        try {
            const response = await axios.post(`${baseURL}/payables/payment/${currPurchase.id}`, body, config);
            const data = response.data.data;

            setOpenSuccess(data.purchase_balance);
            setReceipt(data.transaction.id);
            console.log(data);
        } catch (err) {
            const errorMessage = err.response.data.error;
            setErrorDialog(`Server Error: ${errorMessage}`);
        }
          
    }

    async function uploadReceipt(event, receiptId) {
        const baseURL = API_CLIENT_SIDE();

        let form_data = new FormData();
        form_data.append('file', event.target.files[0], event.target.files[0].name);
        let uploadURL = `${baseURL}/payables/upload/receipt/${receiptId}`;

        await axios.post(uploadURL, form_data, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'JWT ' + currUser.access_token,
            }
            })
            .then(res => {
                const result = res.data.data;
                if (receipt !== null) {
                    window.open(result.receipt_file);
                    history.push("/purchase");
                } else {
                    setErrorDialog("Success: Receipt document is successfully uploaded.");
                    window.open(result.receipt_file, '_blank');
                    let newArray = payments;
                    const objIndex = newArray.findIndex((obj => obj.id === receiptId));
                    newArray[objIndex].receipt_file = result.receipt_file;
                    setPayments(newArray);
                }
            })
            .catch(err => {
                if (err.response) {
                    setErrorDialog(`Error: ${err.response.data.message}`);
                } else {
                    setErrorDialog("Alert: Server is probably down.");
                }
            })
    }

    const handleViewReceipt = (event, fileName) => {
        const baseURL = API_CLIENT_SIDE();
        window.open(fileName);
    }

    const handleLeavePage = () => {
        history.back();
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Record Payment
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
                            orderInvoice={currPurchase.invoice_id}
                            supplier={currPurchase.supplier}
                            amount={paidAmount}
                            setAmount={event => setPaidAmount(event.target.value)}
                            amountBlur={event => handleAmountBlur(event)}
                            submit={event => handlePaymentSubmit(event)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5} md={4}>
                        <Stack direction="column" spacing={3}>
                            <OrderSummary variant="balance" value={currPurchase.purchase_balance} />
                            <OrderSummary variant="daysLeft" value={currPurchase.days_left} />
                        </Stack>
                    </Grid>
                </Grid>

                <PaymentHistory 
                    transactions={currPurchase.payment_history}
                    amountDue={currPurchase.total_amount}
                    balance={currPurchase.purchase_balance}
                    uploadReceipt={(event, receiptId) => uploadReceipt(event, receiptId)}
                    viewReceipt={(event, fileName) => handleViewReceipt(event, fileName)}
                />
            </Stack>

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
                    uploadReceipt={event => uploadReceipt(event, receipt)}
                /> 
            )
        }

        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const orderId = parseInt(ctx.params.purchaseId);
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

    if (!orderId || isNaN(orderId)) {
        return {
            notFound: true
        }
    }

    try {
        const response = await axios({
            url: `${process.env.API_BASE_URL}/payables/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currSession.access_token
            },
            data: {
              query: `
                query GetPurchaseByID ($orderId: Int!) {
                    searchPurchasedOrders (purchaseId: $orderId) {
                        id
                        invoice_id
                        supplier {
                            id
                            full_name
                        }
                        days_left
                        add_charge
                        discount 
                        purchase_date
                        due_date
                        total_amount
                        terms
                        delivered
                        inv_fileName
                        purchase_balance
                        payment_history {
                            id
                            receipt_file
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

        const currPurchase = response.data.data;

        if (!currPurchase.searchPurchasedOrders) {
            return {
                notFound: true
            }
        }
        else {
            return {
                props: { 
                    currUser: currSession,
                    currPurchase: currPurchase.searchPurchasedOrders,
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

