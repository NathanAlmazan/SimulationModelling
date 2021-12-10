import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import dynamic from "next/dynamic";
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const CustomerInfo = dynamic(() => import("../../../components/_customers/profile/CustomerInfo"));
const CustomerOrders = dynamic(() => import("../../../components/_customers/profile/CustomerOrders"), { ssr: false });

export default function UpdateCustomer(props) {
    const { customerData, currUser } = props;
    const history = useRouter();
    const [customerOrders, setCustomerOrders] = useState(customerData.all_orders);
    const [stsYear, setYear] = useState(null);
    const AllowedPosition = ["President", "Vice President", "Manager"];
    const matches = useMediaQuery('(max-width:500px)');

    useEffect(() => {
        async function fetchUpdatedData() {
            const baseURL = API_CLIENT_SIDE();
            const response = await axios({
                url: `${baseURL}/sales/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
                },
                data: {
                    query: `
                    query GetCustomer ($ID: Int!, $Date: DateTime) {
                        searchCustomer (id: $ID) {
                            all_orders (date: $Date) {
                                id 
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
                            }
                        }
                      }
                    `,
                    variables: {
                        ID: customerData.id,
                        Date: new Date(stsYear, 1, 15).toISOString()
                    }
                }
            }).catch(err => {
                if (err.response) {
                    if (err.response.data.error === "Invalid Token") {
                        history.push("/signin");
                    } else {
                        console.log(err.response);
                    }
                } else {
                    history.push("/")
                }
            });

            const customerNewData = response.data.data;
            setCustomerOrders(state => customerNewData.searchCustomer.all_orders);

        }

        if (stsYear !== null) {
            fetchUpdatedData();
        }

    }, [stsYear, currUser, history, customerData]);

    const handleYearChange = (event, value) => {
        if (stsYear === null) {
            if (value === "next") {
                setYear(new Date().getFullYear() + 1);
            } else {
                setYear(new Date().getFullYear() - 1);
            }
        } else {
            if (value === "next") {
                setYear(stsYear + 1);
            } else {
                setYear(stsYear - 1);
            }
        }
    }

    const handleUnarchived = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/sales/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + currUser.access_token,
                },
                data: {
                query: `
                    mutation UpdateCustomer ($ID: Int!, $Active: Boolean) {
                      updateCustomer (id: $ID, is_active: $Active) {
                            id
                        }
                    }
                `,
                variables: {
                    ID: customerData.id,
                    Active: true
                    }
                }
            });
    
            history.push("/customers");
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                console.log(err);
            }
        }
      }

    const handleArchive = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/sales/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + currUser.access_token,
                },
                data: {
                query: `
                    mutation UpdateCustomer ($ID: Int!, $Active: Boolean) {
                      updateCustomer (id: $ID, is_active: $Active) {
                            id
                        }
                    }
                `,
                variables: {
                    ID: customerData.id,
                    Active: false
                    }
                }
            });
    
            history.push("/customers/archived");
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                console.log(err)
            }
        }
      }

      const handleDelete = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/sales/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + currUser.access_token,
                },
                data: {
                query: `
                    mutation DeleteCustomer ($ID: Int!) {
                        permaDeleteCustomer (id: $ID) {
                            id
                        }
                    }
                `,
                variables: {
                    ID: customerData.id,
                    }
                }
            });
    
            history.push("/customers");
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                console.log(err)
            }
        }
      }

    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Customer Profile
                    </Typography>
                   {!matches ? (
                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => history.push("/customers/edit/" + customerData.id)}
                                startIcon={<EditIcon />}
                            >
                                Edit
                            </Button>
                            {AllowedPosition.includes(currUser.position) && (
                                customerData.is_active ? (
                                    <Button
                                        disabled={Boolean(customerData.total_credits > 0)}
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleArchive()}
                                        startIcon={<ArchiveIcon />}
                                    >
                                        Archive
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleUnarchived()}
                                        startIcon={<UnarchiveIcon />}
                                    >
                                        Unarchive
                                    </Button>
                                )
                            )}
                        </Stack>
                   ) : (
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                            <IconButton
                                variant="contained"
                                color="secondary"
                                onClick={() => history.push("/customers/edit/" + customerData.id)}
                            >
                                <EditIcon />
                            </IconButton>
                            {AllowedPosition.includes(currUser.position) && (
                                customerData.is_active ? (
                                    <IconButton
                                        disabled={Boolean(customerData.total_credits > 0)}
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleArchive()}
                                    >
                                       <ArchiveIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleUnarchived()}
                                    >
                                        <UnarchiveIcon />
                                    </IconButton>
                                )
                            )}
                        </Stack>
                   )}
                </Stack>

                <Stack direction="column" spacing={3}>
                    <Card sx={{ padding: 5 }}>
                        <CustomerInfo
                            customer={customerData}
                            user={currUser}
                        />
                    </Card>
                    <CustomerOrders
                        token={currUser !== null ? currUser.access_token : null}
                        orders={customerOrders}
                        purpose="customerData" 
                        changeYear={(event, value) => handleYearChange(event, value)}  
                        year={stsYear}
                    />
                </Stack>
                {Boolean(customerData.all_orders.length === 0 && !customerData.is_active) && (
                     <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </Button>
                )}
            </Container>
    )
}

export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];

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
    const customerId = parseInt(ctx.params.customerId);

    if (!customerId || isNaN(customerId)) {
        return {
            notFound: true
        };
    }

    try {
        const response = await axios({
          url: `${process.env.API_BASE_URL}/sales/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY,
          },
          data: {
            query: `
              query GetCustomer ($ID: Int!) {
                searchCustomer (id: $ID) {
                    id
                    first_name
                    last_name
                    contact_number
                    company_name
                    email
                    website
                    address
                    city
                    province
                    total_credits
                    is_active
                    all_orders {
                        id 
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
                    }
                }
              }
            `,
            variables: {
                ID: customerId,
            }
          }
        });

      const customerData = response.data.data;
      
      if (!customerData.searchCustomer) {
          return {
              notFound: true,
          }
      }

      return {
          props: { 
              customerData: customerData.searchCustomer,
              currUser: currSession
          }
      }

    } catch (err) {
        console.log(err)
        return {
            notFound: true
        };
    }
}  