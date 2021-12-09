import { useRef, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';



// ----------------------------------------------------------------------

export default function CustomerMenu(props) {
  const { selected, setSelected } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuChange = (value) => {
    setSelected(value);
    setIsOpen(!isOpen);
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <FilterListIcon />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem selected={Boolean(selected === "Order ID")} onClick={event => handleMenuChange("Order ID")} sx={{ color: 'text.secondary' }}>
          <ListItemText primary="Invoice ID" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem selected={Boolean(selected === "Agent")} onClick={event => handleMenuChange("Agent")} sx={{ color: 'text.secondary' }}>
          <ListItemText primary="Agent Name" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
