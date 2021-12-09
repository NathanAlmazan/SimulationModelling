import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import API_CLIENT_SIDE from '../../layouts/APIConfig';
import axios from 'axios';
import dynamic from "next/dynamic";

//dynamic components
const ArchivedListTable = dynamic(() => import('../../components/_orders/dashboard/ArchivedTable'));
const OrderDialog = dynamic(() => import('../../components/_orders/dashboard/ErrorDialog'));

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default function DeliverOrders(props) {
    const { deliveryOrders } = props;
    const [Orders, setOrders] = useState(deliveryOrders)
    const [selected, setSelected] = useState([]);
    const [currUser, setCurrUser] = useState(null);
    const history = useRouter();
    const [openError, setOpenError] = useState(null);
    const forceUpdate = useForceUpdate();
    const [openSuccess, setOpenSuccess] = useState(null);


    const deliverOrders = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `JWT ${currUser.access_token}`,
            }
          };
        
        const baseURL = API_CLIENT_SIDE();

        try {
            for (let i = 0; i < selected.length; i++) {
                await axios.get(`${baseURL}/sales/delivered-order/${selected[i]}`, config);
            }
          
          setOpenSuccess(`Sucess: ${selected.length} orders was delivered successfully.`);
          setSelected([]);
          refetchData();
    
        } catch (err) {
          const errResponse = err.response.data !== undefined ? err.response.data.error : null;
          if (errResponse !== null) {
            setOpenError(`Archive Failed: ${errResponse}`);
          } else {
            setOpenError(`Server Error: Server is probably down.`);
          }
        }
      }

    useEffect(() => {
        async function authenticate () {
            const session = await getSession();
            if (!session) {
                history.push("/signin");
            }
            setCurrUser(state => session);
        }
       
        authenticate();
    }, [history]);
    
    const refetchData = async () => {
        
        const baseURL = API_CLIENT_SIDE();
        try {
            const response = await axios({
                url: `${baseURL}/sales/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${currUser.access_token}`
                },
                data: {
                query: `
                    query DeliveryOrders {
                        showOrdersToBeDelivered {
                            id 
                            customer {
                                id
                                full_name
                            }
                            employee {
                                id
                                full_name
                            }
                            order_date
                            due_date
                            delivered
                            amount_due
                            order_balance
                            days_left
                        }
                    }
                `,
                }
              });
      
            const deliveryOrders = response.data.data;
            forceUpdate();
            setOrders(deliveryOrders.showOrdersToBeDelivered);

        } catch (err) {
            const errorMessage = !err.response ? null : err.response.data.error;
            if (errorMessage !== null) {
                setOpenError(`Refetch Error: ${errorMessage}`);
            } else {
                setOpenError(`Server Error: Server is probably down.`);
            }
        }
    }

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1)
          );
        }
        setSelected(newSelected);
      };

    const onRedirect = (event, path) => {
      history.push(path);
    }
    
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Shipping Orders
                </Typography>
            </Stack>

            <ArchivedListTable
                handleClick={(event, id) => handleClick(event, id)} 
                selected={selected} 
                token={currUser !== null ? currUser.access_token : null}
                orders={Orders}
                hideCheckbox={false}
                purpose="delivery"
                allFunction={deliverOrders}
                refreshData={refetchData}
                clearSelected={value => setSelected(value)}
            />

        {openError !== null && (
            <OrderDialog
            open={openError}
            setOpen={value => setOpenError(value)}
            />
        )}

        {openSuccess !== null && (
            <OrderDialog 
            open={openSuccess}
            setOpen={value => setOpenSuccess(value)}
            />
        )}
            
        </Container>
    )
}

export async function getServerSideProps(ctx) {

    try {
        const response = await axios({
            url: `${process.env.API_BASE_URL}/sales/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY
            },
            data: {
            query: `
                query DeliveryOrders {
                    showOrdersToBeDelivered {
                        id 
                        customer {
                            id
                            full_name
                        }
                        employee {
                            id
                            full_name
                        }
                        order_date
                        due_date
                        delivered
                        amount_due
                        days_left
                    }
                }
            `,
            }
          });
  
        const deliveryOrders = response.data.data;

        return {
            props: { deliveryOrders: deliveryOrders.showOrdersToBeDelivered }
        }

    } catch (err) {
        const errorMessage = !err.response ? null : err.response.data.error;
        if (errorMessage === "Invalid Token") {
            return {
                redirect: {
                  permanent: false,
                  destination: '/signin'
                }
              }
        } else {
            return {
                notFound: true
            }
        }
    }
  }

