import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ products, onSet, selectedProducts, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product, index) => {
        const isItemSelected = selectedProducts.map(function(p) { return p.id; }).indexOf(product.id) !== -1;
        return (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} onChecked={event => onSet(event, product)} checked={isItemSelected}/>
        </Grid>
      )}
      )}
    </Grid>
  );
}
