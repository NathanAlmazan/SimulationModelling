import { useState, useEffect } from 'react';
import { filter } from 'lodash';
// material
import { Container, Stack, Typography, Button, OutlinedInput, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// components
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import dynamic from "next/dynamic";
import { styled } from '@mui/material/styles';
import { getSession } from "next-auth/client";
import ArchiveIcon from '@mui/icons-material/Archive';
//data fetching
import axios from 'axios';

const ProductSort = dynamic(() => import("../../components/_products/ProductSort"));
const ProductList = dynamic(() => import("../../components/_products/ProductList"));
const ProductFilterSidebar = dynamic(() => import("../../components/_products/ProductFilterSidebar"));
const ProductCartWidget = dynamic(() => import("../../components/_products/ProductCartWidget"));

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

export default function Products({ allProducts, allCategories, currUser }) {
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [filterName, setFilterName] = useState("");
  const [currDetail, setCurrDetail] = useState('');
  const [sortOption, setSortOption] = useState(0);
  const [currCategory, setCategory] = useState("all");
  const history = useRouter();

  const ExecutivePosition = ["President", "Vice President", "Manager"];

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const onCategoryChange = (value) => {
    setCategory(value);
    setCurrDetail('');
  }

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
    setCategory("all");
    setCurrDetail('');
  }

 
  const onSubmit = () => {
    setFilterName("");
    if (currCategory !== "all") {
      const newProductArray = allProducts.filter(product => product.category.name === currCategory);

      if (currDetail !== '') {
        const filterUnit = currDetail.split("_")[2];
        const filters = {type: currDetail.split("_")[0], 
            num_value: filterUnit !== "null" ? parseFloat(currDetail.split("_")[1]) : null,
            unit: filterUnit !== "null" ? filterUnit : null,
            text_value: filterUnit !== "null" ? null : currDetail.split("_")[1]
        };

        let newFilteredProducts = [];
        newProductArray.forEach(product => {
          const productDetail = product.details.filter(detail => detail.type === filters.type && detail.unit === filters.unit && detail.text_value === filters.text_value && detail.num_value === filters.num_value);
          if (productDetail.length !== 0) {
            newFilteredProducts.push(product);
          }
        })
        handleSort(sortOption, newFilteredProducts);
        handleCloseFilter();
      } else {
        handleSort(sortOption, newProductArray);
        handleCloseFilter();
      }
    } else {
      handleCloseFilter();
    }
  }

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSort(sortOption, allProducts);
    setCategory("all");
    setCurrDetail('');
    handleCloseFilter();
  };

  return (
      <Container>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          {ExecutivePosition.includes(currUser.position) && (
            <Button
              variant="contained"
              onClick={e => onRouterClick(e, "/products/create")}
              startIcon={<AddIcon />}
            >
              Add Product
            </Button>
          )}
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
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              detail={currDetail}
              setDetail={detail => setCurrDetail(detail)}
              categories={allCategories}
              category= {currCategory}
              onCategoryChange={category => onCategoryChange(category)}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onSubmitFilter={onSubmit}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort currOption={sortOption} setOption={option => handleSort(option, filteredProducts)} />
          </Stack>
        </Stack>

        <ProductList products={filteredProducts} archived={false} />
        <ProductCartWidget value={filteredProducts.length} />
      </Container>
  );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);

    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin'
        }
      }
    }

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
                  showAllProducts {
                    id
                    name
                    stocks
                    price
                    image_name
                    bar_code
                    totalSold
                    details {
                      type
                      num_value
                      unit
                      text_value
                    }
                    category {
                      name
                    }
                  }
              }
            `,
          }
        });
      
        const response_2 = await axios({
          url: `${process.env.API_BASE_URL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY
          },
          data: {
            query: `
              query GetAllCategories {
                getAllCategories {
                  id
                  name
                  suggestedDetails
                }
              }
            `,
          }
        });

      const allProducts = response.data.data;
      const allCategories = response_2.data.data;
    
      if (!allProducts.showAllProducts || !allCategories.getAllCategories) {
        return {
          notFound: true,
        }
      }
    
      return {
        props: { allProducts: allProducts.showAllProducts, allCategories: allCategories.getAllCategories, currUser: session }
      }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
