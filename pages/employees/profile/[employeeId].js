import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getSession } from 'next-auth/client';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from 'axios';
import dynamic from "next/dynamic";

const EmployeeInfo = dynamic(() => import("../../../components/_employees/profile/EmployeeInfo"));
const EmployeeSales = dynamic(() => import("../../../components/_employees/profile/EmployeeSales"), { ssr: false });
const ErrorDialog = dynamic(() => import('../../../components/_products/create/ErrorDialog'));
const EmployeeSalesGraph = dynamic(() => import('../../../components/_employees/profile/SalesGraph'), { ssr: false });

export default function EmployeeProfile(props) {
    const { employeeData, currUser } = props;
    const history = useRouter();
    const [employeeSales, setEmployeeSales] = useState(employeeData.all_sales);
    const [stsYear, setYear] = useState(null);
    const [employeeImage, setEmployeeImage] = useState(null);
    const [imageURL, setImageURL] = useState(employeeData.profile_image);
    const [errorDialog, setErrorDialog] = useState(null);
    const [salesReport, setSalesReport] = useState(employeeData.sales_report);

    const ExecutivePosition = ["President", "Vice President", "Manager"];
    const Personnel = ["Warehouse Staff", "Delivery Personnel"];

    useEffect(() => {
        async function fetchUpdatedData() {
            const baseURL = API_CLIENT_SIDE();
            const response = await axios({
                url: `${baseURL}/users/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
                },
                data: {
                    query: `
                    query GetCustomer ($ID: Int!, $Date: DateTime) {
                      searchEmployee (employeeId: $ID) {
                            all_sales (date: $Date) {
                                id 
                                customer {
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
                            total_customers (date: $Date)
                            sales_report (date: $Date)
                        }
                      }
                    `,
                    variables: {
                        ID: employeeData.id,
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

            const employeeNewData = response.data.data;
            setEmployeeSales(state => employeeNewData.searchEmployee.all_sales);
            setSalesReport(state => employeeNewData.searchEmployee.sales_report)

        }

        if (stsYear !== null) {
            fetchUpdatedData();
        }

    }, [stsYear, currUser, history, employeeData]);

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

    useEffect(() => {
      const handleChangeImage = async () => {
        const baseURL = API_CLIENT_SIDE();
        let form_data = new FormData();
        form_data.append('image', employeeImage, employeeImage.name);
        let uploadURL = `${baseURL}/users/upload/profile/${employeeData.id}`;
  
        await axios.post(uploadURL, form_data, {
          headers: {
              'content-type': 'multipart/form-data',
              'Authorization': 'JWT ' + currUser.access_token,
          }
          })
          .then(res => {
            const profileImageData = res.data;
            setImageURL(profileImageData.fileName);
          })
          .catch(err => {
              if (err.response) {
                  setErrorDialog("Error: " + err.response.data.message);
              } else {
                  setErrorDialog("Alert: Server is probably down.");
              }
          });   
      } 

      if (employeeImage !== null) {
        handleChangeImage();
      }

    }, [employeeImage, currUser, employeeData]);

    const handleArchiveEmployee = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/users/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
                },
                data: {
                    query: `
                    mutation UpdateEmployee ($ID: Int!, $Active: Boolean) {
                        updateEmployee (id: $ID, is_active: $Active) {
                            id
                        }
                      }
                    `,
                    variables: {
                        ID: employeeData.id,
                        Active: false
                    }
                }
            });

            history.reload();
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                history.push("/")
            }
        }
    }

    const handleUnarchiveEmployee = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/users/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currUser.access_token,
                },
                data: {
                    query: `
                    mutation UpdateEmployee ($ID: Int!, $Active: Boolean) {
                        updateEmployee (id: $ID, is_active: $Active) {
                            id
                        }
                      }
                    `,
                    variables: {
                        ID: employeeData.id,
                        Active: true
                    }
                }
            });

            history.reload();
        } catch (err) {
            if (err.response) {
                if (err.response.data.error === "Invalid Token") {
                    history.push("/signin");
                } else {
                    console.log(err.response);
                }
            } else {
                history.push("/")
            }
        }
    }
    
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Employee Profile
                </Typography>
               
                <Stack direction="row" spacing={2}>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => history.push("/employees/edit/" + employeeData.id)}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                {ExecutivePosition.includes(currUser.position) && (
                    !employeeData.is_active ? (
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => handleUnarchiveEmployee()}
                            startIcon={<UnarchiveIcon />}
                        >
                            Unarchive
                        </Button>
                    ) : (
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => handleArchiveEmployee()}
                            startIcon={<ArchiveIcon />}
                        >
                            Archive
                        </Button>
                    )
                    )}
                </Stack>
            </Stack>
        
            <Stack direction="column" spacing={3}>
              <EmployeeInfo 
                employee={employeeData}
                setImage={event => setEmployeeImage(event.target.files[0])}
                imageURL={imageURL}
              />
            {!Personnel.includes(employeeData.position) && (
                <>
                    <EmployeeSales
                        token={currUser !== null ? currUser.access_token : null}
                        orders={employeeSales}
                        changeYear={(event, value) => handleYearChange(event, value)}  
                        year={stsYear}
                        position={currUser.position}
                    />
                {employeeData.position === "AGENT" && (
                    <EmployeeSalesGraph 
                        year={stsYear}
                        graphData={salesReport}
                    />
                )}   
                </>
            )}
            </Stack>

            <ErrorDialog 
                open={errorDialog}
                setOpen={value => setErrorDialog(value)}
            />
        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const currSession = await getSession(ctx);
    const ExecutivePosition = ["President", "Vice President", "Manager"];
    const Personnel = ["CASHIER", "ACCOUNTANT"];

    if (!currSession) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin'
        }
      }
    }

    const employeeId = parseInt(ctx.params.employeeId);
    if (!employeeId || isNaN(employeeId)) {
        return {
            notFound: true
        };
    }

    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + currSession.access_token,
        }
      }

    const result = await axios.get(`${process.env.API_BASE_URL}/users/user`, config);
    const profile = result.data.account;

    if (ExecutivePosition.includes(currSession.position) || profile.employeeId === employeeId) {
        
        try {
            const response_1 = await axios({
            url: `${process.env.API_BASE_URL}/users/graphql`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + process.env.BACKEND_KEY,
            },
            data: {
                query: `
                query GetEmployee ($ID: Int!) {
                    searchEmployee (employeeId: $ID) {
                        id
                        full_name
                        contact_number
                        email
                        position
                        zip_code
                        address
                        city
                        province
                        profile_image
                        sales_report
                        is_active
                        all_sales {
                            id 
                            customer {
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
                    ID: employeeId,
                }
            }
            });

            const employeeData_1 = response_1.data.data;
            
            if (!employeeData_1.searchEmployee) {
                return {
                    notFound: true,
                }
            } else if (Personnel.includes(employeeData_1.searchEmployee.position)) {
                try {
                    const response_2 = await axios({
                    url: `${process.env.API_BASE_URL}/users/graphql`,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'KEY ' + process.env.BACKEND_KEY,
                    },
                    data: {
                        query: `
                        query GetEmployee ($ID: Int!) {
                            searchEmployee (employeeId: $ID) {
                                id
                                full_name
                                contact_number
                                email
                                position
                                zip_code
                                address
                                city
                                province
                                profile_image
                                is_active
                                user_account {
                                    encoded_orders {
                                        id 
                                        customer {
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
                        }
                        `,
                        variables: {
                            ID: employeeId,
                        }
                    }
                    });
        
                const employeeData_2 = response_2.data.data;
                
                if (!employeeData_2.searchEmployee) {
                    return {
                        notFound: true,
                    }
                }

                const employeeInfo = employeeData_2.searchEmployee;
                employeeInfo.all_sales = employeeInfo.user_account !== null ? employeeInfo.user_account.encoded_orders : [];
        
                return {
                    props: { 
                        employeeData: employeeInfo,
                        currUser: currSession
                    }
                }
        
                } catch (err) {
                    console.log(err)
                    return {
                        notFound: true
                    };
                }
            } else {
                return {
                    props: { 
                        employeeData: employeeData_1.searchEmployee,
                        currUser: currSession
                    }
                }
            }

        } catch (err) {
            console.log(err)
            return {
                notFound: true
            };
        }
        
    } else {
        return {
            redirect: {
              permanent: false,
              destination: '/401'
            }
        }
    }
} 

