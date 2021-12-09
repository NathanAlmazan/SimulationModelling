import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import dynamic from "next/dynamic";
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const SupplierInfo = dynamic(() => import("../../../components/_customers/profile/CustomerInfo"));
const SupplierOrders = dynamic(() => import("../../../components/_supplier/profile/SupplierOrders"), { ssr: false });

export default function UpdateCustomer(props) {
    const { supplierData, currUser } = props;
    const history = useRouter();
    const [supplierOrders, setSupplierOrders] = useState(supplierData.supplied_orders);
    const [stsYear, setYear] = useState(null);
    const AllowedPosition = ["President", "Vice President", "Manager"];

    useEffect(() => {
        async function fetchUpdatedData() {
            const baseURL = API_CLIENT_SIDE();
            const response = await axios({
                url: `${baseURL}/payables/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
                },
                data: {
                    query: `
                    query GetSupplier ($ID: Int!, $Date: DateTime) {
                        searchSupplier (supplierId: $ID) {
                            supplied_orders (date: $Date) {
                                id 
                                invoice_id
                                purchase_date
                                due_date
                                delivered
                                purchase_balance
                                total_amount
                                days_left
                            }
                        }
                      }
                    `,
                    variables: {
                        ID: supplierData.id,
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

            const supplierNewData = response.data.data;
            setSupplierOrders(state => supplierNewData.searchSupplier.supplied_orders);

        }

        if (stsYear !== null) {
            fetchUpdatedData();
        }

    }, [stsYear, currUser, history, supplierData]);

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
                url: `${baseURL}/payables/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + currUser.access_token,
                },
                data: {
                query: `
                    mutation UnArchiveSupplier ($ID: Int!) {
                      UnArchiveSupplier (supplierId: $ID) {
                            id
                        }
                    }
                `,
                variables: {
                    ID: supplierData.id,
                    }
                }
            });
    
            history.push("/suppliers");
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                history.push("/");
            }
        }
      }
    
      const handleArchive = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/payables/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + currUser.access_token,
                },
                data: {
                query: `
                  mutation archiveSupplier ($ID: Int!) {
                    archiveSupplier (supplierId: $ID) {
                          id
                      }
                  }
                `,
                variables: {
                    ID: supplierData.id,
                    }
                }
            });
    
            history.push("/suppliers/archived");
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                history.push("/");
            }
        }
      }

      const handleDelete = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/payables/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + currUser.access_token,
                },
                data: {
                query: `
                  mutation DeleteSupplier ($ID: Int!) {
                    deleteSupplier (supplierId: $ID) {
                          id
                      }
                  }
                `,
                variables: {
                    ID: supplierData.id,
                    }
                }
            });
    
            history.push("/suppliers");
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                history.push("/");
            }
        }
      }

    return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Supplier Profile
                    </Typography>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => history.push("/suppliers/edit/" + supplierData.id)}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    {AllowedPosition.includes(currUser.position) && (
                        supplierData.is_active ? (
                            <Button
                                disabled={Boolean(supplierData.total_collecting > 0)}
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
                </Stack>

                <Stack direction="column" spacing={3}>
                    <Card sx={{ padding: 5 }}>
                        <SupplierInfo
                            customer={supplierData}
                            user={currUser}
                        />
                    </Card>
                    <SupplierOrders
                        token={currUser !== null ? currUser.access_token : null}
                        orders={supplierOrders}
                        purpose="supplierData" 
                        changeYear={(event, value) => handleYearChange(event, value)}  
                        year={stsYear}
                    />
                    {Boolean(supplierData.supplied_orders.length === 0 && !supplierData.is_active) && (
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete()}
                        >
                        Delete
                    </Button>
                    )}
                </Stack>
            </Container>
    )
}

export async function getServerSideProps(ctx) {
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
      
    const supplierId = parseInt(ctx.params.supplierId);

    if (!supplierId || isNaN(supplierId)) {
        return {
            notFound: true
        };
    }

    try {
        const response = await axios({
          url: `${process.env.API_BASE_URL}/payables/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY,
          },
          data: {
            query: `
              query GetSupplier ($ID: Int!) {
                searchSupplier (supplierId: $ID) {
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
                    total_collecting
                    is_active
                    supplied_orders {
                        id 
                        invoice_id
                        purchase_date
                        due_date
                        delivered
                        purchase_balance
                        total_amount
                        days_left
                    }
                }
              }
            `,
            variables: {
                ID: supplierId,
            }
          }
        });

      const supplierData = response.data.data;
      
      if (!supplierData.searchSupplier) {
          return {
              notFound: true,
          }
      }

      return {
          props: { 
                supplierData: supplierData.searchSupplier,
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