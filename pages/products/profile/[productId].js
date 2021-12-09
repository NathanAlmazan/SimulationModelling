import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Grid from '@mui/material/Grid';
import dynamic from "next/dynamic";
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import axios from 'axios';

const ProductImage = dynamic(() => import('../../../components/_products/create/ProductImage'));
const ProductInfo = dynamic(() => import('../../../components/_products/create/ProductInfo'));
const ProductMeasure = dynamic(() => import('../../../components/_products/create/ProductMeasure'));
const ProductDesc = dynamic(() => import('../../../components/_products/create/ProductDesc'));
const ProductStatistics = dynamic(() => import('../../../components/_products/statistics/ProductStatistics'), { ssr: false });

export default function ProductProfile(props) {
    const { productData } = props;
    const [measurements, setMeasurements] = useState([]);
    const [imageName, setImageName] = useState(null);
    const [descriptions, setDescriptions] = useState([]);
    const [salesHistory, setSalesHistory] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [userPosition, setPosition] = useState("");
    const [active, setActive] = useState(true);
    const [stsYear, setYear] = useState(null);
    const [productInfo, setProductInfo] = useState({
        name: "",
        category: "",
        barCode: "",
        stocks: "",
        price: ""
    });
    const history = useRouter();

    const ExecutivePosition = ["President", "Vice President", "Manager"];

    useEffect(() => {
        async function getPageSession() {
            const session = await getSession();

            if (!session) {
                history.push("/signin");
            }

            setAccessToken(state => session.access_token);
            setPosition(state => session.position);
        }

        getPageSession();
    }, [history]);

    useEffect(() => {
        if (productData) {
            const { id, name, bar_code, stocks, price, image_name, details, category, sales_history, purchase_history, is_active } = productData;
            setActive(state => is_active);
            setImageName(state => image_name);
            setProductInfo(product => ({ ...product,  
                name: name,
                category: category.name,
                barCode: bar_code,
                stocks: stocks,
                price: price.toFixed(2)
            }));

            let productDesc = [];
            let productMes = [];

            details.forEach(detail => {
                if (!detail.unit) {
                    productDesc.push(detail);
                } else {
                    productMes.push(detail);
                }
            });

            setMeasurements(state => productMes);
            setDescriptions(state => productDesc);
            setSalesHistory(state => sales_history);
            setPurchaseHistory(state => purchase_history);
        }
    }, [productData]);

    useEffect(() => {
        async function fetchUpdatedData() {
            const baseURL = API_CLIENT_SIDE();
            const response = await axios({
                url: `${baseURL}/product/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + accessToken,
                },
                data: {
                    query: `
                    query GetProduct ($ID: Int!, $Date: DateTime) {
                        getUniqueProduct (id: $ID) {
                          sales_history (date: $Date)
                          purchase_history (date: $Date)
                        }
                      }
                    `,
                    variables: {
                        ID: productData.id,
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

            const productNewData = response.data.data;
            setSalesHistory(state => productNewData.getUniqueProduct.sales_history);
            setPurchaseHistory(state => productNewData.getUniqueProduct.purchase_history);

        }

        if (stsYear !== null && productData !== null) {
            fetchUpdatedData();
        }

    }, [stsYear, accessToken, history, productData]);


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

    const handleArchive = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/product/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + accessToken,
                },
                data: {
                query: `
                    mutation UpdateProduct ($ID: Int!, $Active: Boolean) {
                        updateProduct (id: $ID, is_active: $Active) {
                            id
                            name
                        }
                    }
                `,
                variables: {
                    ID: productData.id,
                    Active: false
                    }
                }
            });

            history.push("/products/archived");
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

    const handleUnarchived = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/product/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + accessToken,
                },
                data: {
                query: `
                    mutation UpdateProduct ($ID: Int!, $Active: Boolean) {
                        updateProduct (id: $ID, is_active: $Active) {
                            id
                            name
                        }
                    }
                `,
                variables: {
                    ID: productData.id,
                    Active: true
                    }
                }
            });

            history.push("/products");
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

    const handleDelete = async () => {
        const baseURL = API_CLIENT_SIDE();
        try {
            await axios({
                url: `${baseURL}/product/graphql`,
                method: 'post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KEY ' + accessToken,
                },
                data: {
                query: `
                    mutation DeleteProduct ($ID: Int!) {
                        permaDeleteProduct (id: $ID) {
                            id
                            name
                        }
                    }
                `,
                variables: {
                    ID: productData.id
                    }
                }
            });

            history.push("/products");
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
                    Product Profile
                </Typography>
            {ExecutivePosition.includes(userPosition) && (
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>  history.push("/products/edit/" + productData.id)}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    {active === true ? (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleArchive()}
                            startIcon={<ArchiveIcon />}
                        >
                            Archive
                        </Button>
                    ) : !productData.clearToDelete ? (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleUnarchived()}
                            startIcon={<UnarchiveIcon />}
                        >
                            Restore
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete()}
                            startIcon={<UnarchiveIcon />}
                        >
                            Delete
                        </Button>
                    )}
                    
                </Stack>
            )}
            </Stack>
           
                <Grid container spacing={3} direction="row" justifyContent="space-between">
                    <Grid item xs={12} sm={12} md={4}>
                        <ProductImage 
                            imageName={imageName}
                            imageFile={null}
                            profile={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <ProductInfo 
                            product={productInfo}
                            profile={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <ProductMeasure 
                            measurements={measurements}
                            profile={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <ProductDesc 
                            descriptions={descriptions}
                            profile={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <ProductStatistics 
                            salesHistory={salesHistory} 
                            purchaseHistory={purchaseHistory}
                            changeYear={(event, value) => handleYearChange(event, value)}
                            currentYear={stsYear}
                        />
                    </Grid>
                </Grid>

        </Container>
    )
}
  

export async function getServerSideProps(ctx) {
    const productId = parseInt(ctx.params.productId);

    if (!productId || isNaN(productId)) {
        return {
            notFound: true
        };
    }

    try {
        const response = await axios({
          url: `${process.env.API_BASE_URL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY,
          },
          data: {
            query: `
              query GetProduct ($ID: Int!) {
                getUniqueProduct (id: $ID) {
                  id
                  name
                  bar_code
                  stocks
                  price
                  image_name
                  is_active
                  clearToDelete
                  details {
                      id 
                      type
                      num_value
                      text_value
                      unit
                  }
                  category {
                      id
                      name
                  }
                  sales_history
                  purchase_history
                }
              }
            `,
            variables: {
                ID: productId,
            }
          }
        });

      const productData = response.data.data;
      
      if (!productData.getUniqueProduct) {
          return {
              notFound: true,
          }
      }

      return {
          props: { 
              productData: productData.getUniqueProduct
          },
      }

    } catch (err) {
        return {
            notFound: true
        };
    }
}



