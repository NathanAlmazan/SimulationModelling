import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from "next/dynamic";
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import ArchiveIcon from '@mui/icons-material/Archive';

const PurchaseInfo = dynamic(() => import('../../../components/_payables/profile/PurchaseInfo'));
const PurchaseProducts = dynamic(() => import('../../../components/_payables/profile/PurchaseProducts'));
const ErrorDialog = dynamic(() => import('../../../components/_orders/create/ErrorDialog'));
const PaymentHistory = dynamic(() => import('../../../components/_payables/profile/PaymentHistory'), { ssr: false });

export default function UpdateOrder(props) {
    const { currPurchase, currUser } = props;
    const [orderProducts, setOrderProducts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceFilename, setInvoiceFile] = useState("");
    const [errorDialog, setErrorDialog] = useState(null);
    const history = useRouter();
    const [orderForm, setOrderForm] = useState({
        id: "",
        supplierName: "",
        purchase_date: "",
        terms: "",
        due_date: "",
        payment_type: "",
        add_charge: "",
        discount: "",
        totalPrice: "",
        amount_due: "",
        invoice_id: ""
    });
    const AuthorizedPosition = ["President", "Vice President", "Manager"];

    useEffect(() => {
        setOrderForm(orderData => ({ ...orderData, 
            id: currPurchase.id,
            supplierName: currPurchase.supplier.full_name,
            purchase_date: currPurchase.purchase_date,
            terms: currPurchase.terms,
            due_date: currPurchase.due_date,
            payment_type: currPurchase.payment_type,
            add_charge: currPurchase.add_charge,
            discount: currPurchase.discount,
            amount_due: currPurchase.total_amount,
            invoice_id: currPurchase.invoice_id,
            totalPrice: (currPurchase.total_amount - currPurchase.add_charge) + currPurchase.discount
        }));

        setOrderProducts(state => currPurchase.purchased_products);
        setPayments(state => currPurchase.payment_history);
    }, [currPurchase]);

    useEffect(() => {
        async function uploadInvoice() {
            const baseURL = API_CLIENT_SIDE();

            let form_data = new FormData();
            form_data.append('file', selectedInvoice, selectedInvoice.name);
            let uploadURL = `${baseURL}/payables/upload/invoice/${currPurchase.id}`;

            await axios.post(uploadURL, form_data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': 'JWT ' + currUser.access_token,
                }
                })
                .then(res => {
                    const result = res.data.data;
                    setErrorDialog("Success: Invoice document is successfully uploaded.");
                    window.open(result.inv_fileName);
                    setInvoiceFile(state => result.inv_fileName)
                })
                .catch(err => {
                    if (err.response) {
                        setErrorDialog(`Error: ${err.response.data.message}`);
                    } else {
                        setErrorDialog("Alert: Server is probably down.");
                    }
                })
        }

        if (selectedInvoice !== null) {
            uploadInvoice()
        }
    }, [selectedInvoice, currUser, currPurchase]);

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
                setErrorDialog("Success: Receipt document is successfully uploaded.");
                window.open(result.receipt_file, '_blank');
                let newArray = payments;
                const objIndex = newArray.findIndex((obj => obj.id === receiptId));
                newArray[objIndex].receipt_file = result.receipt_file;
                setPayments(newArray);
            })
            .catch(err => {
                if (err.response) {
                    setErrorDialog(`Error: ${err.response.data.message}`);
                } else {
                    setErrorDialog("Alert: Server is probably down.");
                }
            })
    }

    const handleEdit = () => {
        if (!currPurchase.delivered) {
            history.push(`/purchase/edit/${currPurchase.id}`);
        } else {
            setErrorDialog("Alert: You cannot edit this order because it is already delivered.");
        }
    }

    const handleViewInvoice = () => {
        const baseURL = API_CLIENT_SIDE();
        if (currPurchase.inv_fileName !== null) {
            window.open(currPurchase.inv_fileName);
        } 
        else if (invoiceFilename !== "") {
            window.open(invoiceFilename);
        }
        else {
            setErrorDialog("Info: A copy of the purchased invoice is not uploaded yet. Please click 'Upload Invoice' to upload one.");
        }
    }

    const handleViewReceipt = (event, fileName) => {
        const baseURL = API_CLIENT_SIDE();
        window.open(fileName);
    }

    const onFileChange = (event) => {
        setSelectedInvoice(event.target.files[0]);
    }

    const cancelOrder = async () => {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `JWT ${currUser.access_token}`,
            }
          };
        if (!currPurchase.delivered && currPurchase.payment_history.length === 0) {
            try {
                await axios.get(`${baseURL}/payables/cancel/${currPurchase.id}`, config);
                history.push("/purchase");
          
            } catch (err) {
            const errResponse = err.response.data !== undefined ? err.response.data.error : null;
                if (errResponse !== null) {
                    setErrorDialog(`Archive Failed: ${errResponse}`);
                } else {
                    setErrorDialog(`Server Error: Server is probably down.`);
                }
            }
        } else {
            setErrorDialog(`Alert: This order is already delivered or paid.`);
        }
      }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Purchased Profile
                </Typography>
                {AuthorizedPosition.includes(currUser.position) && (
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>  handleEdit()}
                        startIcon={<EditIcon />}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={cancelOrder}
                        startIcon={<ArchiveIcon />}
                    >
                        Cancel
                    </Button>
                </Stack>
                )}
            </Stack>

            <Stack direction="column" spacing={3}>
                <Card sx={{ padding: 5, width: '100%' }}>
                    <PurchaseInfo
                        orderInfo={orderForm}
                     />
                </Card>

                <Card sx={{ padding: 5, width: '100%' }}>
                  <PurchaseProducts
                    orderProducts={orderProducts}
                    orderInfo={orderForm}
                  />
                </Card>

                
                <PaymentHistory 
                    transactions={payments}
                    amountDue={currPurchase.total_amount}
                    balance={currPurchase.purchase_balance}
                    uploadReceipt={(event, receiptId) => uploadReceipt(event, receiptId)}
                    viewReceipt={(event, fileName) => handleViewReceipt(event, fileName)}
                    token={currUser.access_token}
                    reload={() => history.reload()}
                />

                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleViewInvoice()}
                        sx={{ height: 50, fontSize: '16px' }}
                    >
                        View Invoice
                    </Button>

                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ height: 50, fontSize: '16px' }}
                    >
                        Upload Invoice
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                            onChange={event => onFileChange(event)}
                            hidden 
                        />
                    </Button>
                </Stack>
              
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
    const orderId = parseInt(ctx.params.purchaseId);
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

    try {

      const response = await axios({
        url: `${process.env.API_BASE_URL}/payables/graphql`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + currSession.access_token,
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
                    payment_type
                    add_charge
                    discount 
                    purchase_date
                    due_date
                    total_amount
                    terms
                    delivered
                    inv_fileName
                    purchase_balance
                    purchased_products {
                        product {
                            id
                            name
                            init_price
                        }
                        quantity
                        total_price
                    }
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

      return {
        props: {
            currUser: currSession,
            currPurchase: currPurchase.searchPurchasedOrders }
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

