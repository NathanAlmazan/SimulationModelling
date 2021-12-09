import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { headerCase } from 'change-case';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FilterListIcon from '@mui/icons-material/FilterList';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Grid,
  Divider,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
//
import Scrollbar from '../Scrollbar';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' }
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107'
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object
};

export default function ShopFilterSidebar({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  detail,
  setDetail,
  onSubmitFilter,
  category,
  onCategoryChange,
  categories
}) {
  const [currDetails , setCurrDetails] = useState([]);
  
  const handleCategory = (event) => {
    onCategoryChange(event.target.value);
  }

  const handleDetail = (event) => {
    setDetail(event.target.value);
  }

  useEffect(() => {
    if (category !== "all") {
      const categoryObj = categories.find(categ => categ.name === category);
      if (categoryObj) {
        setCurrDetails(state => categoryObj.suggestedDetails !== null ? categoryObj.suggestedDetails : []);
      }
    }
    else if (category === "all") {
      setCurrDetails(state => []);
    }
  }, [category, categories])

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<FilterListIcon />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

        <FormControl autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Filters
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <CloseIcon width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>
                
                  <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Category
                  </Typography>
                  <RadioGroup value={category} onChange={handleCategory}>
                    <FormControlLabel key={0} value="all" control={<Radio />} label={headerCase("All")} />
                    {categories.map((item) => (
                      <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={headerCase(item.name)} />
                    ))}
                  </RadioGroup>
                </div>
              
              {currDetails.length !== 0 && (



                <RadioGroup value={detail} onChange={handleDetail}>
                  <Grid container spacing={3} direction="column" justifyContent="flex-start">

                    {currDetails.map((detail) => {
                      const { detailType, attributes } = detail;

                      return (
                        <Grid item xs={12} sm={12} md={12} key={detailType}>
                          <Typography variant="subtitle1" gutterBottom>
                            {detailType}
                          </Typography>
                          {attributes.map((item) => (
                            <FormControlLabel
                              key={item.value}
                              value={`${detailType}_${item.value}_${item.unit}`}
                              control={<Radio />}
                              label={item.unit !== null ? `${item.value} ${item.unit.split(' ')[0]}` : item.value}
                            />
                          ))}
                        </Grid>
                      )
                    })}
        
                  </Grid>
                </RadioGroup>
     
              )}
                
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="secondary"
                variant="outlined"
                onClick={onSubmitFilter}
                startIcon={<ClearAllIcon />}
              >
                Apply Filter
              </Button>
              <br />
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<ClearAllIcon />}
              >
                Clear All
              </Button>
            </Box>
          </Drawer>
        </FormControl>
    </>
  );
}
