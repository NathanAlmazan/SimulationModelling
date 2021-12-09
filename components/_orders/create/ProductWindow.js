import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { filter } from 'lodash';
import { Stack, OutlinedInput, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import dynamic from "next/dynamic";

const Scrollbar = dynamic(() => import("../../Scrollbar"));
const ProductSort = dynamic(() => import("../../_products/ProductSort"));
const ProductList = dynamic(() => import("./ProductList"));
const ProductCartWidget = dynamic(() => import("./ProductCartWidget"));
const ProductFilterDialog = dynamic(() => import("./FilterDialog"));

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


function ProductWindow(props) {
    const { selectedProducts, setSelected, allProducts, allCategories } = props;
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [filterName, setFilterName] = useState("");
  const [currDetail, setCurrDetail] = useState('');
  const [sortOption, setSortOption] = useState(0);
  const [currCategory, setCategory] = useState("all");

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
    handleSort(sortOption, filterByName);
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

  console.log(selectedProducts);

  const onAddProduct = (event, product) => {
    const selectedIndex = selectedProducts.map(function(p) { return p.id; }).indexOf(product.id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProducts, product);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProducts.slice(1));
    } else if (selectedIndex === selectedProducts.length - 1) {
      newSelected = newSelected.concat(selectedProducts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedProducts.slice(0, selectedIndex),
        selectedProducts.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

    return (
    <Scrollbar>
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
              placeholder="Search product name..."
              startAdornment={
                <InputAdornment position="start">
                  <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
            />
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterDialog
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

        <ProductList products={filteredProducts} onSet={(event, value) => onAddProduct(event, value)} selectedProducts={selectedProducts} />
        <ProductCartWidget value={selectedProducts.length} />
    </Scrollbar>

    )
}

export default ProductWindow
