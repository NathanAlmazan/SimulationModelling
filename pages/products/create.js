import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Grid from '@mui/material/Grid';
import dynamic from "next/dynamic";
import CloseIcon from '@mui/icons-material/Close';
import API_CLIENT_SIDE from '../../layouts/APIConfig';
import axios from 'axios';

const ProductImage = dynamic(() => import('../../components/_products/create/ProductImage'));
const ProductInfo = dynamic(() => import('../../components/_products/create/ProductInfo'));
const ProductMeasure = dynamic(() => import('../../components/_products/create/ProductMeasure'));
const ProductDesc = dynamic(() => import('../../components/_products/create/ProductDesc'));
const MeasureDialog = dynamic(() => import('../../components/_products/create/MeasureDialog'));
const DescDialog = dynamic(() => import('../../components/_products/create/DescDialog'));
const ErrorDialog = dynamic(() => import('../../components/_products/create/ErrorDialog'));

export default function CreateProduct(props) {
    const { currUser } = props;
    const [allCategories, setAllCategories] = useState([]);
    const [MdialogOpen, setMDialogOpen] = useState(false);
    const [CdialogOpen, setCDialogOpen] = useState(false);
    const [measurements, setMeasurements] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [errorDialog, setErrorDialog] = useState(null);
    const [productInfo, setProduct] = useState({
        name: "",
        category: "",
        barCode: "",
        stocks: "",
        price: ""
    });
    const [productImage, setProductImage] = useState(null);
    const history = useRouter();

    useEffect(() => {
        async function getAllCategories() {
            const baseURL = API_CLIENT_SIDE();
            try {
        
                const response = await axios({
                  url: `${baseURL}/product/graphql`,
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'KEY ' + currUser.access_token,
                  },
                  data: {
                    query: `
                      query GetAllCategories {
                        getAllCategories {
                          id
                          name
                          description
                        }
                      }
                    `,
                  }
                });
        
              const allCategories = response.data.data;
              setAllCategories(allCategories.getAllCategories);
        
            } catch (err) {
              if (err.response) {
                  if (err.response.data.error === "Invalid Token") {
                      history.push("/signin");
                  }
              } else {
                setErrorDialog("Alert: Server is probably down.");
              }
            }
        }

        getAllCategories();

    }, [history, currUser, forceUpdate]);

    const handleRedirect = (path) => {
        history.push(path);
    }

    const handleTextChange = (event) => {
        setProduct({ ...productInfo, [event.target.name]: event.target.value});
    }

    const handlePriceChange = (event) => {
        const productPrice = parseFloat(event.target.value);
        if (isNaN(productPrice)) {
            setProduct({ ...productInfo, price: ""});
        } else {
            setProduct({ ...productInfo, price: productPrice});
        }
    }

    const handleImageChange = (event) => {
        setProductImage(event.target.files[0]);
    }

    const handleRemoveDesc = (event, index) => {
        const selectedIndex = index;
        let newSelected = [];
        if (selectedIndex === 0) {
          newSelected = newSelected.concat(descriptions.slice(1));
        } else if (selectedIndex === descriptions.length - 1) {
          newSelected = newSelected.concat(descriptions.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            descriptions.slice(0, selectedIndex),
            descriptions.slice(selectedIndex + 1)
          );
        }
        setDescriptions(newSelected);
    }

    const handleRemoveMeasure = (event, index) => {
        const selectedIndex = index;
        let newSelected = [];
        if (selectedIndex === 0) {
          newSelected = newSelected.concat(measurements.slice(1));
        } else if (selectedIndex === measurements.length - 1) {
          newSelected = newSelected.concat(measurements.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            measurements.slice(0, selectedIndex),
            measurements.slice(selectedIndex + 1)
          );
        }
        setMeasurements(newSelected);
    }

    const handleStockChange = (event) => {
        const productStock = parseInt(event.target.value);
        if (isNaN(productStock)) {
            setProduct({ ...productInfo, stocks: ""});
        } else {
            setProduct({ ...productInfo, stocks: productStock});
        }    
    }

    const handleAddMeasurement = (value) => {
        let currMeasure = measurements;
        currMeasure.push(value);
        setMeasurements(currMeasure);
    }
    
    const handleAddDescription = (value) => {
        let currDescription = descriptions;
        currDescription.push(value);
        setDescriptions(currDescription);
    }

    const handleSubmitForm = async (event) => {
        event.preventDefault();
        
        if (measurements.length === 0 && descriptions.length === 0) {
            setErrorDialog("Warning: Please record atleast one product detail.");
        } else {

            try {
                const baseURL = API_CLIENT_SIDE();
                const { name, category, barCode, price, stocks } = productInfo;
                const ProdDetails = measurements.concat(descriptions);
                
                const response = await axios({
                    url: `${baseURL}/product/graphql`,
                    method: 'post',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'KEY ' + currUser.access_token,
                    },
                    data: {
                    query: `
                        mutation AddNewProduct ($Name: String!, $Code: String, $inStock: Int!, $Category: Int!, $Price: Float!) {
                            addProduct (name: $Name, bar_code: $Code, stocks: $inStock, category_id: $Category, price: $Price) {
                                id
                                name
                            }
                        }
                    `,
                    variables: {
                        Name: name,
                        Code: barCode,
                        inStock: stocks,
                        Category: category,
                        Price: price,
                    }
                    }
                });

                const newProduct = response.data.data;
                const productId = newProduct.addProduct.id;

                for (let x=0; x < ProdDetails.length; x++) {
                    const currDetail = ProdDetails[x];

                    const addedDetail = await axios({
                        url: `${baseURL}/product/graphql`,
                        method: 'post',
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'KEY ' + currUser.access_token,
                        },
                        data: {
                        query: `
                            mutation AddDetailToProduct ($Product: Int!, $Type: String!, $nValue: Float, $tValue: String, $Unit: String) {
                                addDetails (product_id: $Product, type: $Type, unit: $Unit, num_value: $nValue, text_value: $tValue) {
                                    id
                                    type
                                }
                            }
                        `,
                            variables: {
                                Product: productId,
                                Type: currDetail.type,
                                nValue: !currDetail.num_value ? null : currDetail.num_value,
                                tValue: !currDetail.text_value ? null : currDetail.text_value,
                                Unit: !currDetail.unit ? null : currDetail.unit
                            }
                        }
                    });

                }

                if (productImage !== null) {
                    let form_data = new FormData();
                    form_data.append('image', productImage, productImage.name);
                    let uploadURL = `${baseURL}/product/upload-product-image/${productId}`;

                    await axios.post(uploadURL, form_data, {
                        headers: {
                            'content-type': 'multipart/form-data',
                            'Authorization': 'JWT ' + currUser.access_token,
                        }
                        })
                        .then(res => {
                            console.log(res.data.fileName);
                        })
                        .catch(err => {
                            if (err.response) {
                                setErrorDialog(err.response.data.message);
                            } else {
                                setErrorDialog("Alert: Server is probably down.");
                            }
                        })
                }

                history.push("/products");

            } catch (err) {
                if (err.response) {
                    if (err.response.data.error === "Invalid Token") {
                        history.push("/signin");
                    } else {
                        console.log(err.response);
                    }
                } else {
                    setErrorDialog("Alert: Server is probably down.");
                }
            }
        }
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    New Product
                </Typography>
                <Button
                    color="error"
                    variant="contained"
                    onClick={e => handleRedirect("/products")}
                    startIcon={<CloseIcon />}
                >
                    Cancel
                </Button>
            </Stack>
            <form onSubmit={handleSubmitForm} >
                <Grid container spacing={3} direction="row" justifyContent="space-between">
                    <Grid item xs={12} sm={12} md={4}>
                        <ProductImage 
                            onImageChange={event =>  handleImageChange(event)}
                            imageFile={productImage}
                            imageName={null}
                            profile={false}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <ProductInfo 
                            product={productInfo}
                            profile={false}
                            textChange={event => handleTextChange(event)}
                            priceChange={event => handlePriceChange(event)}
                            stockChange={event => handleStockChange(event)}
                            categories={allCategories}
                            token={currUser.access_token}
                            refresh={() => setForceUpdate(!forceUpdate)}
                            disableStock={false}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <ProductMeasure 
                            openDialog={() => setMDialogOpen(true)} 
                            measurements={measurements}
                            removeMeasure={(event, index) => handleRemoveMeasure(event, index)}
                            profile={false}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <ProductDesc 
                            openDialog={() => setCDialogOpen(true)} 
                            descriptions={descriptions}
                            removeDesc={(event, index) => handleRemoveDesc(event, index)}
                            profile={false}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Button
                            fullWidth
                            sx={{ height: 50, fontSize: 16 }}
                            type="submit"
                            variant="contained"
                        >
                            Submit Product
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <MeasureDialog 
                open={MdialogOpen}
                handleClose={() => setMDialogOpen(false)}
                addMeasurement={value => handleAddMeasurement(value)}
            />

            <DescDialog 
                open={CdialogOpen}
                handleClose={() => setCDialogOpen(false)}
                addDescription={value => handleAddDescription(value)}
            />

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

    return {
        props: { currUser: currSession }
    }
}  


