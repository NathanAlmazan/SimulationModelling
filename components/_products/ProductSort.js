import { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'stocksDesc', label: 'Stocks: High-Low' },
  { value: 'stocksAsc', label: 'Stocks: Low-High' },
  { value: 'top', label: 'Sales: High-Low' },
  { value: 'bottom', label: 'Sales: Low-High' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];

export default function ShopProductSort(props) {
  const { currOption, setOption } = props;
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleOptionClick = (event, index) => {
    setOption(index);
    handleClose();
  }

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {SORT_BY_OPTIONS[currOption].label}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={index === currOption}
            onClick={event => handleOptionClick(event, index)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
