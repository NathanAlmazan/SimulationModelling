import React, { useState, useEffect } from 'react';
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
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

const PurchaseInfo = dynamic(() => import('../../../components/_payables/create/PurchaseInfo'));
const ProductTable = dynamic(() => import('../../../components/_payables/create/ProductTable'));
const ProductDialog = dynamic(() => import('../../../components/_orders/create/ProductDialog'));
const SupplierDialog = dynamic(() => import('../../../components/_payables/create/SupplierDialog'));
const ErrorDialog = dynamic(() => import('../../../components/_orders/create/ErrorDialog'));
const SuccessDialog = dynamic(() => import('../../../components/_payables/create/SuccessDialog'));

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function PurchaseOrder(props) {
    const { allProducts, allCategories, allSuppliers, currPurchase, currUser } = props;
    const [openDialog,setOpenDialog] = useState(false);
    const [orderProducts, setOrderProducts] = useState([]);
    const [editable, setEditable] = useState(false);
    const [openSupplier, setOpenSupplier] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [errorDialog, setErrorDialog] = useState(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const forceUpdate = useForceUpdate();
    const history = useRouter();
    const [orderForm, setOrderForm] = useState({
      purchase_date: new Date().toISOString(),
      invoiceId: "",
      terms: "",
      due_date: new Date().toISOString(),
      payment_type: "",
      addCharge: "",
      discount: "",
      total_price: "",
      total_amount: ""
    });
    const [orderErrors, setOrderErrors] = useState({
      add_charge: null,
      discount: null,
      terms: null,
    });

    useEffect(() => {
        setOrderForm(orderData => ({ ...orderData, 
            purchase_date: currPurchase.purchase_date,
            terms: currPurchase.terms,
            due_date: currPurchase.due_date,
            payment_type: currPurchase.payment_type,
            addCharge: currPurchase.add_charge,
            discount: currPurchase.discount,
            total_amount: currPurchase.total_amount,
            invoiceId: currPurchase.invoice_id,
            total_price: (currPurchase.total_amount - currPurchase.add_charge) + currPurchase.discount
        }));

        setSelectedSupplier(state => currPurchase.supplier);

        let initialProducts = [];
        currPurchase.purchased_products.forEach(obj => {
            const currProduct = allProducts.find(product => product.id === obj.product.id);
            currProduct.init_price = obj.product.init_price;
            currProduct.quantity = obj.quantity;
            currProduct.orderSum = obj.total_price;
            initialProducts.push(currProduct);
        });

        setOrderProducts(state => initialProducts);
    }, [currPurchase, allProducts])

    const submitNewOrder = async () => {

      const { payment_type, addCharge, discount, purchase_date, due_date, invoiceId } = orderForm;

      if (orderProducts.length === 0) {
        setErrorDialog("No Product selected: Products are required.");
      }
      else if (payment_type === "" || !payment_type) {
        setErrorDialog(`Order Input Error: Payment type is required.`);
      }
      else if (isNaN(addCharge)) {
        setErrorDialog(`Order Input Error: additional charge input is not a number.`);
      }
      else if (isNaN(discount)) {
        setErrorDialog(`Order Input Error: Discount is not a number.`);
      }
      else if (new Date(purchase_date) === 'Invalid Date') {
        setErrorDialog(`Order Input Error: Invalid order date.`);
      }
      else if (!selectedSupplier) {
        setErrorDialog(`Order Input Error: No selected Supplier.`);
      }
      else {
        let products = [];
        let cleared = true;

        orderProducts.forEach((product, index) => {
          if (!product.quantity || product.quantity === "") {
            setErrorDialog(`${product.name}: No specified quantity.`);
            cleared = false;
          }
          else if (!product.init_price || product.init_price === "") {
            setErrorDialog(`${product.name}: No specified suppliers price.`);
            cleared = false;
          }
          else {
            products.push({ id: product.id, quantity: product.quantity, price: product.init_price });
          }
        });

        const body = JSON.stringify({ 
          products: products,
          purchaseInfo: {
            supplier_id: selectedSupplier.id,
            account_id: currUser.userId,
            invoice_id: invoiceId !== "" ? invoiceId : null,
            payment_type: payment_type,
            add_charge: addCharge !== "" ? addCharge : null,
            discount: discount !== "" ? discount : null,
            purchase_date: purchase_date,
            due_date: due_date
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
            const response = await axios.post(`${baseURL}/payables/update/${currPurchase.id}`, body, config);
            const orderInfo = response.data.data;
            setOrderId(orderInfo.id);
            setSuccessDialog(true);

          } catch (err) {
            const errorMessage = err.response.data.error;
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
      newArray[objIndex].orderSum = newArray[objIndex].init_price !== undefined ? newArray[objIndex].init_price * quantity : 0;
      forceUpdate();
      setOrderProducts(newArray);
      updateOrderPrice();
    }

    const handlePriceBlur = (event, id) => {
      const price = parseFloat(event.target.value);
      let newArray = orderProducts;

      const objIndex = newArray.findIndex((obj => obj.id === id));
      newArray[objIndex].init_price = price;
      newArray[objIndex].orderSum = newArray[objIndex].quantity !== undefined ? newArray[objIndex].quantity * price : 0;
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

    async function uploadInvoice(event) {
      const baseURL = API_CLIENT_SIDE();

      let form_data = new FormData();
      form_data.append('file', event.target.files[0], event.target.files[0].name);
      let uploadURL = `${baseURL}/payables/upload/invoice/${orderId}`;

      await axios.post(uploadURL, form_data, {
          headers: {
              'content-type': 'multipart/form-data',
              'Authorization': 'JWT ' + currUser.access_token,
          }
          })
          .then(res => {
              const result = res.data.data;
              window.open(result.inv_fileName);
              history.push("/purchase");
          })
          .catch(err => {
              if (err.response) {
                  setErrorDialog(`Error: ${err.response.data.message}`);
              } else {
                  console.log(err);
              }
          })
      }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Record Purchase
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
                <Card sx={{ padding: 5, width: '100%' }}>
                  <PurchaseInfo 
                    selectedSupplier={selectedSupplier}
                    setOpenSupplier={value => setOpenSupplier(value)}
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
                    handlePriceBlur={(event, id) => handlePriceBlur(event, id)}
                    discount={orderForm.discount}
                    charges={orderForm.addCharge}
                    totalPrice={orderForm.total_price}
                    removeProduct={(event, id) => onRemoveProduct(event, id)}
                  />
               
                </Card>

                <Button
                  variant="contained"
                  onClick={submitNewOrder}
                  sx={{ height: 40 }}
                  >
                  Update Purchased Order
                </Button>
            </Stack>


            <ProductDialog 
                open={openDialog} setOpen={value => setOpenDialog(value)} 
                setOrders={ value => setOrderProducts(value)} 
                orderProducts={orderProducts}
                products={allProducts} 
                categories={allCategories} 
            />

            <SupplierDialog
                open={openSupplier} 
                setOpen={value => setOpenSupplier(value)} 
                selected={selectedSupplier} 
                setSelected={value => setSelectedSupplier(value)} 
                suppliers={allSuppliers} 
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
                redirect={path => history.push(path)}
                uploadInvoice={event => uploadInvoice(event)}
                update={true}
              />
          )}
         

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
                    init_price
                    image_name
                    price
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
          url: `${process.env.API_BASE_URL}/payables/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + currSession.access_token,
          },
          data: {
            query: `
              query ShowSuppliers {
                allActiveSuppliers {
                      id
                      full_name
                      company_name
                  }
              }
            `,
          }
      });

      const response_4 = await axios({
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
                }
            }
          `,
          variables: {
            orderId: orderId,
          }
        }
      });

      const allProducts = response.data.data;
      const allCategories = response_2.data.data;
      const allSuppliers = response_3.data.data;
      const currPurchase = response_4.data.data;

      return {
        props: { allProducts: allProducts.showAllProducts, 
            allCategories: allCategories.getAllCategories, 
            allSuppliers: allSuppliers.allActiveSuppliers,
            currPurchase: currPurchase.searchPurchasedOrders,
            currUser: currSession }
      }

    } catch (err) {
      if (err.response) {
        if (err.response.data.error === "Invalid Token") {
          return {
            redirect: {
              permanent: false,
              destination: '/signin'
            }
          }
        }
      } else return {
        notFound: true,
      }
    }
  }

