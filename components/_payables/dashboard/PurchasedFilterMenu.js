import { useRef, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';



// ----------------------------------------------------------------------

export default function FilterMenu(props) {
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

        <MenuItem selected={Boolean(selected === "Invoice")} onClick={event => handleMenuChange("Invoice")} sx={{ color: 'text.secondary' }}>
          <ListItemText primary="Invoice ID" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem selected={Boolean(selected === "Supplier")} onClick={event => handleMenuChange("Supplier")} sx={{ color: 'text.secondary' }}>
          <ListItemText primary="Supplier Name" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem selected={Boolean(selected === "Record ID")} onClick={event => handleMenuChange("Record ID")} sx={{ color: 'text.secondary' }}>
          <ListItemText primary="Record ID" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

      </Menu>
    </>
  );
}
