import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from "next/dynamic";
import API_CLIENT_SIDE from '../../layouts/APIConfig';

const RegisterOrder = dynamic(() => import('../../components/_orders/create/RegisterOrder'));
const ProductTable = dynamic(() => import('../../components/_orders/create/ProductTable'));
const ProductDialog = dynamic(() => import('../../components/_orders/create/ProductDialog'));
const CustomerDialog = dynamic(() => import('../../components/_orders/create/CustomerDialog'));
const ErrorDialog = dynamic(() => import('../../components/_orders/create/ErrorDialog'));
const SuccessDialog = dynamic(() => import('../../components/_orders/create/SuccessDialog'));

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function CreateOrder(props) {
    const { allProducts, allCategories, allCustomers, allAgents, currUser } = props;
    const [openDialog,setOpenDialog] = useState(false);
    const [orderProducts, setOrderProducts] = useState([]);
    const [editable, setEditable] = useState(false);
    const [openCustomer, setOpenCustomer] = useState(false);
    const [openAgent, setOpenAgent] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [errorDialog, setErrorDialog] = useState(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const [generatedInvoice, setGenerated] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const forceUpdate = useForceUpdate();
    const history = useRouter();
    const [orderForm, setOrderForm] = useState({
      order_date: new Date().toISOString(),
      terms: "",
      due_date: new Date().toISOString(),
      payment_type: "",
      vat: "",
      discount: "",
      total_price: "",
      total_amount: ""
    });
    const [orderErrors, setOrderErrors] = useState({
      vat: null,
      discount: null,
      terms: null,
    });

    const submitNewOrder = async () => {

      const { payment_type, vat, discount, order_date, terms } = orderForm;

      if (orderProducts.length === 0) {
        setErrorDialog("No Product selected: Products are required.");
      }
      else if (payment_type === "" || !payment_type) {
        setErrorDialog(`Order Input Error: Payment type is required.`);
      }
      else if (isNaN(vat)) {
        setErrorDialog(`Order Input Error: VAT input is not a number.`);
      }
      else if (isNaN(discount)) {
        setErrorDialog(`Order Input Error: Discount is not a number.`);
      }
      else if (new Date(order_date) === 'Invalid Date') {
        setErrorDialog(`Order Input Error: Invalid order date.`);
      }
      else if (!selectedAgent) {
        setErrorDialog(`Order Input Error: No selected Sales Agent.`);
      }
      else if (!selectedCustomer) {
        setErrorDialog(`Order Input Error: No selected Customer.`);
      }
      else {
        let products = [];
        let cleared = true;

        orderProducts.forEach((product, index) => {
          if (!product.quantity || product.quantity === "") {
            setErrorDialog(`${product.name}: No specified quantity.`);
            cleared = false;
          }
          else if (product.quantity > product.stocks) {
            setErrorDialog(`${product.name}: Not enough stocks.`);
            cleared = false;
          }
          else {
            products.push({ id: product.id, quantity: product.quantity });
          }
        });

        const body = JSON.stringify({ 
          products: products,
          order: {
            employee_id: selectedAgent.id,
            customer_id: selectedCustomer.id,
            account_id: currUser.userId,
            payment_type: payment_type,
            vat: vat !== "" ? vat : null,
            discount: discount !== "" ? discount : null,
            order_date: order_date,
            terms: terms !== "" ? terms : null
          }
        });
  
        const baseURL = API_CLIENT_SIDE();
  
        const config = {
          headers: {
              'Content-Type': 'application/json', 
              'Authorization': `JWT ${currUser.access_token}`,
          }
        };

        if (cleared) {
          try {
            const response = await axios.post(`${baseURL}/sales/addOrder`, body, config);
            const orderInfo = response.data.data;
            setOrderId(orderInfo.id);
            setSuccessDialog(true);

          } catch (err) {
            const errorMessage = err.response.data.error;
            console.log(errorMessage);
            setErrorDialog(`Server Error: ${errorMessage}`);
          }
        }

      }
    }

    const updateOrderPrice = () => {
      let totalPrice = 0;
      orderProducts.forEach(product => {
        if (product.orderSum !== undefined || !isNaN(product.orderSum)) {
          totalPrice += product.orderSum;
        }
      });
      setOrderForm({...orderForm, total_price: totalPrice});
    }

    const handleQuantityBlur = (event, id) => {
      const quantity = parseInt(event.target.value);
      let newArray = orderProducts;

      const objIndex = newArray.findIndex((obj => obj.id === id));
      newArray[objIndex].quantity = quantity;
      newArray[objIndex].orderSum = newArray[objIndex].price * quantity;
      forceUpdate();
      setOrderProducts(newArray);
      updateOrderPrice();
    }

    const onRemoveProduct = (event, id) => {
      const selectedIndex = orderProducts.map(function(p) { return p.id; }).indexOf(id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(orderProducts, product);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(orderProducts.slice(1));
      } else if (selectedIndex === orderProducts.length - 1) {
        newSelected = newSelected.concat(orderProducts.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          orderProducts.slice(0, selectedIndex),
          orderProducts.slice(selectedIndex + 1)
        );
      }
      setOrderProducts(newSelected);
    }

    const handleLeavePage = (path) => {
      if (!generatedInvoice) {
        const baseURL = API_CLIENT_SIDE();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
            }
        };

        axios.get(`${baseURL}/sales/generate-invoice/${orderId}`, config);
        history.push(path);

      } else {
        history.push(path);
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
          const response = await axios.get(`${baseURL}/sales/generate-invoice/${orderId}`, config);
          const orderInvoice = response.data.data;

          window.open(orderInvoice);
          setGenerated(true);

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
                  New Order
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => history.push("/orders")}
                  startIcon={<CloseIcon />}
                  >
                  Cancel
                </Button>
            </Stack>

            <Stack direction="column" spacing={3}>
                <Card sx={{ padding: 5, width: '100%' }}>
                    <RegisterOrder 
                        setOpenCustomer={value => setOpenCustomer(value)} 
                        selectedCustomer={selectedCustomer} 
                        setOpenAgent={value => setOpenAgent(value)} 
                        selectedAgent={selectedAgent}
                        orderForm={orderForm}
                        orderErrors={orderErrors}
                        setOrderForm={value => setOrderForm(value)}
                        setOrderErrors={value => setOrderErrors(value)}
                        editable={editable}
                        />
                </Card>

                <Card sx={{ padding: 5, width: '100%' }}>
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={5}>
                      <Button
                        variant="contained"
                        onClick={() => setOpenDialog(!openDialog)}
                        startIcon={<AddIcon />}
                        >
                        Add Products
                      </Button>
                  </Stack>

                  <ProductTable 
                    orderProducts={orderProducts}
                    handleQuantityBlur={(event, id) => handleQuantityBlur(event, id)}
                    discount={orderForm.discount}
                    totalPrice={orderForm.total_price}
                    removeProduct={(event, id) => onRemoveProduct(event, id)}
                  />
               
                </Card>

                <Button
                  variant="contained"
                  onClick={submitNewOrder}
                  sx={{ height: 40 }}
                  >
                  Place Order
                </Button>
            </Stack>


            <ProductDialog 
                open={openDialog} setOpen={value => setOpenDialog(value)} 
                setOrders={ value => setOrderProducts(value)} 
                orderProducts={orderProducts}
                products={allProducts} 
                categories={allCategories} 
            />

            <CustomerDialog 
                open={openCustomer} 
                setOpen={value => setOpenCustomer(value)} 
                selected={selectedCustomer} 
                setSelected={value => setSelectedCustomer(value)} 
                customers={allCustomers} 
                agent={false} 
            />

            <CustomerDialog 
                open={openAgent} 
                setOpen={value => setOpenAgent(value)} 
                selected={selectedAgent} 
                setSelected={value => setSelectedAgent(value)} 
                customers={allAgents} 
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

          {successDialog !== false && (
              <SuccessDialog 
                open={successDialog}
                orderId={orderId}
                redirect={path => handleLeavePage(path)}
                generateInvoice={() => handleGenerateInvoice()}
                update={false}
              />
          )}
         

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

    try {

      const response = await axios({
          url: `${process.env.API_BASE_URL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + currSession.access_token,
          },
          data: {
            query: `
              query GetAllProducts {
                  showAllProducts {
                    id
                    name
                    stocks
                    price
                    image_name
                    totalSold
                    details {
                      type
                      num_value
                      unit
                      text_value
                    }
                    category {
                      name
                    }
                  }
              }
            `,
          }
        });
      
        const response_2 = await axios({
          url: `${process.env.API_BASE_URL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + currSession.access_token,
          },
          data: {
            query: `
              query GetAllCategories {
                getAllCategories {
                  id
                  name
                  suggestedDetails
                }
              }
            `,
          }
        });

        const response_3 = await axios({
          url: `${process.env.API_BASE_URL}/sales/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + currSession.access_token,
          },
          data: {
            query: `
              query ShowCustomera {
                  showAllCustomers {
                      id
                      full_name
                      company_name
                      total_credits
                  }
              }
            `,
          }
      });

      const response_4 = await axios({
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

      const allProducts = response.data.data;
      const allCategories = response_2.data.data;
      const allCustomers = response_3.data.data;
      const allAgents = response_4.data.data;

      return {
        props: { allProducts: allProducts.showAllProducts, 
            allCategories: allCategories.getAllCategories, 
            allCustomers: allCustomers.showAllCustomers,
            allAgents: allAgents.allAgents,
            currUser: currSession }
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

