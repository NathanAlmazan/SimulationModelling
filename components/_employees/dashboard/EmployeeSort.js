import { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'total_sold:desc', label: 'Sales: High-Low' },
  { value: 'total_sold:asc', label: 'Sales: Low-High' }
];

export default function EmployeeSort(props) {
  const { currOption, setOption } = props;
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleOptionClick = (event, value) => {
    setOption(value);
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
          {currOption.label}
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
            selected={option.value === currOption.value}
            onClick={event => handleOptionClick(event, option)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
