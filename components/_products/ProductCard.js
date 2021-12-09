import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import API_CLIENT_SIDE from '../../layouts/APIConfig';
// utils
//
import Label from '../Label';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { id, name, image_name, price, stocks } = product;
  const history = useRouter();

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const baseURL = API_CLIENT_SIDE();

  return (
    <Card key={id}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {stocks < 10 && (
          <Label
            variant="filled"
            color="error"
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            Low Stock
          </Label>
        )}
        <ProductImgStyle 
          alt={name} 
          src={!image_name ?  "https://drive.google.com/uc?id=1_Cl5hghtYvVvTP-1hE4gJpzSIqXABvRY&export=download" : image_name}  
          onClick={e => onRouterClick(e, `/products/profile/${id}`)}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" onClick={e => onRouterClick(e, `/products/profile/${id}`)}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',  }}>
            <Inventory2RoundedIcon color="secondary" sx={{ marginRight: 0.5, transform: "scale(0.8)" }} /> 
            {stocks}
          </Typography>
          <Typography variant="subtitle1">
            &nbsp;
            {'₱' + price.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
