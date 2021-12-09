import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
// material
import { Box, Card, Link, Typography, Stack, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
// utils

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

export default function ShopProductCard({ product, onChecked, checked }) {
  const { id, name, image_name, price, stocks } = product;
  const history = useRouter();

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const baseURL = API_CLIENT_SIDE();

  return (
    <Card key={id}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
          <Checkbox
            checked={checked}
            onChange={event => onChecked(event)}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute'
            }}
          />
        <ProductImgStyle alt={name} src={image_name !== null ? image_name : "https://drive.google.com/uc?id=1_Cl5hghtYvVvTP-1hE4gJpzSIqXABvRY&export=download"} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" onClick={e => onRouterClick(e, "/")}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',  }}>
            <Inventory2RoundedIcon color={stocks < 10 ? "error" : "secondary"} sx={{ marginRight: 0.5, transform: "scale(0.8)" }} /> 
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
