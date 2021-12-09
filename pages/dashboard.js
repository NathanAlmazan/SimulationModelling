// material
import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import fileDownload from 'js-file-download';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import axios from 'axios';
// components
import dynamic from "next/dynamic";
import API_CLIENT_SIDE from '../layouts/APIConfig';

const TotalReceivables = dynamic(() => import('../components/_dashboard/app/TotalReceivables'));
const TotalDelivery = dynamic(() => import('../components/_dashboard/app/TotalDelivery'));
const TotalShipment = dynamic(() => import('../components/_dashboard/app/TotalShipment'));
const TotalPayables = dynamic(() => import('../components/_dashboard/app/TotalPayables'));
const BackupManager = dynamic(() => import('../components/_dashboard/app/BackupManager'));
const AccountDashboard = dynamic(() => import('../components/_dashboard/app/AccountDashboard'), { ssr: false });
const CategoryBoard = dynamic(() => import('../components/_dashboard/app/CategoryBoard'), { ssr: false });
const AgentPerformance = dynamic(() => import('../components/_dashboard/app/AgentPerformance'), { ssr: false });
const EventTimeline = dynamic(() => import('../components/_dashboard/app/EventTimeline'), { ssr: false });
const ProductStatus = dynamic(() => import('../components/_dashboard/app/ProductStatus'), { ssr: false });

// ----------------------------------------------------------------------

export default function DashboardApp(props) {
    const { statistics } = props;
    const [currUser, setCurrUser] = useState(null);
    const [salesDate, setSalesDate] = useState(null);
    const [salesData, setSalesData] = useState(statistics.sales_report);
    const [productDate, setProductDate] = useState(null);
    const [productData, setProductData] = useState(statistics.category_statistics);
    const [eventDate, setEventDate] = useState(null);
    const [eventData, setEventData] = useState(statistics.order_timeline);
    const [agentDate, setAgentDate] = useState(null);
    const [agentData, setAgentData] = useState(statistics.top_agents);
    const history = useRouter();
    const AuthorizedPosition = ["President", "Vice President", "Manager"];
    const Personnel = ["President", "Vice President", "Manager", "Accountant"];

    useEffect(() => {
        async function authenticate () {
            const session = await getSession();
            const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];
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

    useEffect(() => {
      async function refectchData() {
        const baseURL = API_CLIENT_SIDE();
        try {
          const response = await axios({
            url: `${baseURL}/statistics/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currUser.access_token
            },
            data: {
              query: `
                  query GetStatistics ($date: DateTime) {
                    sales_report (selected_date: $date) {
                        start_date
                        end_date
                        total_sales
                        total_purchase
                    }
                  }
              `,
              variables: {
                  date: new Date(salesDate).toISOString(),
              }
            }
          });
  
          const appStatistics = response.data.data;
          setSalesData(state => appStatistics.sales_report);

        } catch (err) {
          if (err.response) {
            if (err.response.data.error === "Invalid Token") {
                history.push("/signin");
            } else {
                console.log(err);
            }
           
          } else {
            console.log(err);
          }
        }
      }

      if (salesDate !== null) {
        refectchData();
      }

    }, [salesDate, currUser, history])

    useEffect(() => {
      async function refectchData() {
        const baseURL = API_CLIENT_SIDE();
        try {
          const response = await axios({
            url: `${baseURL}/statistics/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currUser.access_token
            },
            data: {
              query: `
                  query GetStatistics ($date: DateTime) {
                    category_statistics (selected_date: $date) {
                      category_name
                      total_sold
                    }
                  }
              `,
              variables: {
                  date: new Date(productDate).toISOString(),
              }
            }
          });
  
          const appStatistics = response.data.data;
          setProductData(state => appStatistics.category_statistics);

        } catch (err) {
          if (err.response) {
            if (err.response.data.error === "Invalid Token") {
                history.push("/signin");
            } else {
                console.log(err);
            }
           
          } else {
            console.log(err);
          }
        }
      }

      if (productDate !== null) {
        refectchData();
      }

    }, [productDate, currUser, history])

    useEffect(() => {
      async function refectchData() {
        const baseURL = API_CLIENT_SIDE();
        try {
          const response = await axios({
            url: `${baseURL}/statistics/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currUser.access_token
            },
            data: {
              query: `
                  query GetStatistics ($date: DateTime) {
                    order_timeline (selected_date: $date) {
                      start_date
                      due_credits
                      due_orders
                    }
                  }
              `,
              variables: {
                  date: new Date(eventDate).toISOString(),
              }
            }
          });
  
          const appStatistics = response.data.data;
          setEventData(state => appStatistics.order_timeline);

        } catch (err) {
          if (err.response) {
            if (err.response.data.error === "Invalid Token") {
                history.push("/signin");
            } else {
                console.log(err);
            }
           
          } else {
            console.log(err);
          }
        }
      }

      if (eventDate !== null) {
        refectchData();
      }

    }, [eventDate, currUser, history])

    useEffect(() => {
      async function refectchData() {
        const baseURL = API_CLIENT_SIDE();
        try {
          const response = await axios({
            url: `${baseURL}/statistics/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + currUser.access_token
            },
            data: {
              query: `
                  query GetStatistics ($date: DateTime) {
                    top_agents (selected_date: $date) {
                      agent_name
                      total_sales
                    }
                  }
              `,
              variables: {
                  date: new Date(agentDate).toISOString(),
              }
            }
          });
  
          const appStatistics = response.data.data;
          setAgentData(state => appStatistics.top_agents);

        } catch (err) {
          if (err.response) {
            if (err.response.data.error === "Invalid Token") {
                history.push("/signin");
            } else {
                console.log(err);
            }
           
          } else {
            console.log(err);
          }
        }
      }

      if (agentDate !== null) {
        refectchData();
      }

    }, [agentDate, currUser, history])

    const handleFileDownload = async (tableName) => {
      const baseURL = API_CLIENT_SIDE();
      axios
      .get(`${baseURL}/backup/files/${tableName}/backupFile.csv`, {
        responseType: "blob",
        headers: {
          'Authorization': 'JWT ' + currUser.access_token
        }
      })
      .then((res) => {
        fileDownload(res.data, `${tableName}.csv`);
      });
    }

  return (
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
            {currUser !== null && (
                <Typography variant="h4">{`Good Day, ${currUser.user.name}`}</Typography>
            )}
        </Box>
        {currUser !== null && (
        <Grid container spacing={3}>
            
          <Grid item xs={12} sm={6} md={3}>
            <TotalReceivables data={statistics.receivables_count} />
          </Grid>
         
         
          <Grid item xs={12} sm={6} md={3}>
            <TotalDelivery data={statistics.shipping_count} />
          </Grid>
         
          <Grid item xs={12} sm={6} md={3}>
            <TotalShipment data={statistics.arriving_count} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TotalPayables data={statistics.payables_count} />
          </Grid>

          {Personnel.includes(currUser.position) && (       
          <Grid item xs={12} md={6} lg={8}>
            <AccountDashboard data={salesData} date={salesDate} setDate={value => setSalesDate(value)} />
          </Grid>
          )}

          {Personnel.includes(currUser.position) && (  
          <Grid item xs={12} md={6} lg={4}>
            <CategoryBoard data={productData} date={productDate} setDate={value => setProductDate(value)} />
          </Grid>
          )}

          {AuthorizedPosition.includes(currUser.position) && (  
          <Grid item xs={12} md={6} lg={8}>
            < AgentPerformance data={agentData} date={agentDate} setDate={value => setAgentDate(value)} />
          </Grid>
          )}
          
          <Grid item xs={12} md={6} lg={4}>
            <EventTimeline data={eventData} date={eventDate} setDate={value => setEventDate(value)} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <ProductStatus data={statistics.product_status} />
          </Grid>

          {AuthorizedPosition.includes(currUser.position) && (  
          <Grid item xs={12} md={6} lg={4}>
            <BackupManager downloadFile={name => handleFileDownload(name)}  />
          </Grid>
          )}
        </Grid>
        )}
      </Container>
  );
}

export async function getStaticProps(ctx) {

    const currentDate = new Date();
    const month_date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    try {
      const response = await axios({
          url: `${process.env.API_BASE_URL}/statistics/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY
          },
          data: {
            query: `
                query GetStatistics ($date: DateTime, $currDate: DateTime) {
                    receivables_count
                    payables_count
                    shipping_count
                    arriving_count
                    sales_report (selected_date: $date) {
                        start_date
                        end_date
                        total_sales
                        total_purchase
                    }
                    category_statistics (selected_date: $date) {
                        category_name
                        total_sold
                    }
                    top_agents (selected_date: $date) {
                        agent_name
                        total_sales
                    }
                    order_timeline (selected_date: $currDate) {
                        start_date
                        due_credits
                        due_orders
                    }
                    product_status {
                      name
                      stocks
                    }
                }
            `,
            variables: {
                date: month_date.toISOString(),
                currDate: new Date().toISOString() 
            }
          }
        });

      const appStatistics = response.data.data;
    
      if (!appStatistics) {
        return {
          notFound: true,
        }
      }
    
      return {
        props: { statistics: appStatistics },
        revalidate: 60
      }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
