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
const ArchivedListTable = dynamic(() => import('../../components/_payables/dashboard/ArchivedListTable'));
const OrderDialog = dynamic(() => import('../../components/_orders/dashboard/ErrorDialog'));

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default function CanceledOrders(props) {
    const { canceledOrders } = props;
    const [Orders, setOrders] = useState(canceledOrders)
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
                await axios.get(`${baseURL}/payables/restore/${selected[i]}`, config);
            }
          
          setOpenSuccess(`Sucess: ${selected.length} orders restore successfully.`);
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
            const ExecutivePosition = ["President", "Vice President", "Manager"];
            if (!session) {
                history.push("/signin");
            }
            if (!ExecutivePosition.includes(session.position)) {
                history.push("/401");
            }
            setCurrUser(state => session);
        }
       
        authenticate();
    }, [history]);
    
    const refetchData = async () => {
        
        const baseURL = API_CLIENT_SIDE();
        try {
            const response = await axios({
                url: `${baseURL}/payables/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${currUser.access_token}`
                },
                data: {
                query: `
                    query CanceledOrders {
                        allInactiveOrders {
                            id 
                            supplier {
                                id
                                full_name
                            }
                            purchase_date
                            invoice_id
                            due_date
                            total_amount
                            days_left
                        }
                    }
                `,
                }
              });
      
            const canceledOrders = response.data.data;
            forceUpdate();
            setOrders(canceledOrders.allInactiveOrders);

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
                    Canceled Purchase
                </Typography>
            </Stack>

            <ArchivedListTable
                handleClick={(event, id) => handleClick(event, id)} 
                selected={selected} 
                token={currUser !== null ? currUser.access_token : null}
                orders={Orders}
                hideCheckbox={false}
                purpose="restore"
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
            url: `${process.env.API_BASE_URL}/payables/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY
            },
            data: {
            query: `
                query CanceledOrders {
                    allInactiveOrders {
                        id 
                        supplier {
                            id
                            full_name
                        }
                        purchase_date
                        invoice_id
                        due_date
                        total_amount
                        days_left
                    }
                }
            `,
            }
          });
  
        const canceledOrders = response.data.data;

        return {
            props: { canceledOrders: canceledOrders.allInactiveOrders }
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

