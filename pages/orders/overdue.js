import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import axios from 'axios';
import dynamic from "next/dynamic";

//dynamic components
const OverDueList = dynamic(() => import('../../components/_orders/dashboard/OverDueList'));

export default function SalesOrder(props) {
    const { overdueOrders } = props;
    const [selected, setSelected] = useState([]);
    const [currUser, setCurrUser] = useState(null);
    const history = useRouter();

    useEffect(() => {
        async function authenticate () {
            const session = await getSession();
            const Personnel = ["Warehouse Staff", "Delivery Personnel", "Sales Agent"];
            if (!session) {
                history.push("/signin");
            }

            if (Personnel.includes(session.position)) {
                history.push("/401");
            }
            setCurrUser(state => session);
        }
       
        authenticate();
    }, [history]);

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
    
    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Overdue Orders
                </Typography>
            </Stack>

            <OverDueList
                selected={selected} 
                token={currUser !== null ? currUser.access_token : null}
                orders={overdueOrders}
                hideCheckbox={true}
                purpose="overdue"
                allFunction={null}
                refreshData={null}
                clearSelected={value => setSelected(value)}
            />
            
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
                query GetOverdueOrders {
                    showOverdueOrders {
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
                        order_balance
                        amount_due
                        days_left
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
            }
          });
  
        const overdueOrders = response.data.data;

        return {
            props: { overdueOrders: overdueOrders.showOverdueOrders },
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

