import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import ArchivedCard from './ArchivedCard'

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ products, archived, handleUnarchived, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          {!archived ? (
            <ShopProductCard product={product} />
          ) : (
            <ArchivedCard product={product} handleUnarchived={(event, id) => handleUnarchived(event , id)} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
