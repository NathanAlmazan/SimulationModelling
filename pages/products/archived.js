import { useState, useEffect } from 'react';
import { filter } from 'lodash';
// material
import { Container, Stack, Typography, OutlinedInput, InputAdornment, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
// components
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";
import { styled } from '@mui/material/styles';
import { getSession } from "next-auth/client";
import API_CLIENT_SIDE from '../../layouts/APIConfig';
//data fetching
import axios from 'axios';

const ProductSort = dynamic(() => import("../../components/_products/ProductSort"));
const ProductList = dynamic(() => import("../../components/_products/ProductList"), { ssr: false });

// ----------------------------------------------------------------------

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

export default function Products({ allProducts }) {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [filterName, setFilterName] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [sortOption, setSortOption] = useState(0);
  const history = useRouter();

  useEffect(() => {
    const getCurrSession = async () => {
      const session = await getSession();
      const ExecutivePosition = ["President", "Vice President", "Manager"];
      if (!session) {
        history.push("/signin");
      }
      if (!ExecutivePosition.includes(session.position)) {
        history.push("/401");
      }
      setAccessToken(state => session.access_token);
    }

    getCurrSession();
  }, [history]);

  const handleSort = (value, array) => {
    setSortOption(value);
    var currProducts = array;

    if (value === 0) {
      const newProductArray = currProducts.sort(function(a, b){return b.stocks - a.stocks});
      setFilteredProducts(newProductArray);
    }
    else if (value === 1) {
      const newProductArray = currProducts.sort(function(a, b){return a.stocks - b.stocks});
      setFilteredProducts(newProductArray);
    }
    else if (value === 2) {
      const newProductArray = currProducts.sort(function(a, b){return b.totalSold - a.totalSold});
      setFilteredProducts(newProductArray);
    }
    else if (value === 3) {
      const newProductArray = currProducts.sort(function(a, b){return a.totalSold - b.totalSold});
      setFilteredProducts(newProductArray);
    }
    else if (value === 4) {
      const newProductArray = currProducts.sort(function(a, b){return b.price - a.price});
      setFilteredProducts(newProductArray);
    }
    else if (value === 5) {
      const newProductArray = currProducts.sort(function(a, b){return a.price - b.price});
      setFilteredProducts(newProductArray);
    }
  }

  const filterProductsName = (productName) => {
    const filterByName = filter(allProducts, (_product) => _product.name.toLowerCase().indexOf(productName.toLowerCase()) !== -1);
    if (productName !== "") {
        const filterByBarCode = filter(allProducts, (_product) => _product.bar_code !== null ? _product.bar_code.indexOf(productName) !== -1 : _product.bar_code !== null);
        handleSort(sortOption, filterByName.concat(filterByBarCode));
    } else {
        handleSort(sortOption, filterByName);
    }
  } 

  const onFilterName = (event) => {
    setFilterName(event.target.value);
    filterProductsName(event.target.value);
  }

  const handleUnarchived = async (event, id) => {
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
                  ID: id,
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
              history.push("/");
          }
      }
  }

  return (
      <Container>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Archived Products
          </Typography>
          <Button
            variant="outlined"
            onClick={e => onRouterClick(e, "/customers")}
            startIcon={<ArrowBackIcon />}
          >
            Active Prodcuts
          </Button>
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <SearchStyle
              value={filterName}
              onChange={onFilterName}
              placeholder="Search product..."
              startAdornment={
                <InputAdornment position="start">
                  <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
            />
          
        <ProductSort currOption={sortOption} setOption={option => handleSort(option, filteredProducts)} />

        </Stack>

        <ProductList products={filteredProducts} archived={true} handleUnarchived={(event, id) => handleUnarchived(event, id)} />

      </Container>
  );
}

export async function getServerSideProps(ctx) {

    try {
      const response = await axios({
          url: `${process.env.API_BASE_URL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY
          },
          data: {
            query: `
              query GetAllProducts {
                showArchivedProducts {
                    id
                    name
                    stocks
                    price
                    image_name
                    bar_code
                    totalSold
                  }
              }
            `,
          }
        });

      const allProducts = response.data.data;
    
      if (!allProducts.showArchivedProducts) {
        return {
          notFound: true,
        }
      }
    
      return {
        props: { allProducts: allProducts.showArchivedProducts }
      }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
