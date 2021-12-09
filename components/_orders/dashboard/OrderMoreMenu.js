import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from 'axios';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import dynamic from "next/dynamic";

const OrderDialog = dynamic(() => import('./ErrorDialog'));

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const { id, token, delivered, isPaid, position } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openError, setOpenError] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(null);
  const history = useRouter();
  const ExecutivePosition = ["President", "Vice President", "Manager"];

  const config = {
    headers: {
        'Content-Type': 'application/json', 
        'Authorization': `JWT ${token}`,
    }
  };

  const baseURL = API_CLIENT_SIDE();

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  const cancelOrder = async () => {
    try {
      await axios.get(`${baseURL}/sales/hold-order/${id}`, config);
      setOpenSuccess(`Sucess: Order ${id} was canceled successfully. You can restore canceled order by navigating to archived sales orders' page.`);
      setIsOpen(false);

    } catch (err) {
      const errResponse = err.response.data !== undefined ? err.response.data.error : null;
      if (errResponse !== null) {
        setOpenError(`Archive Failed: ${errResponse}`);
        setIsOpen(false);
      } else {
        setOpenError(`Server Error: Server is probably down.`);
        setIsOpen(false);
      }
    }
  }

  const deliverOrder = async () => {
    try {
      await axios.get(`${baseURL}/sales/delivered-order/${id}`, config);
      setOpenSuccess(`Sucess: Order ${id} was delivered successfully.`);
      setIsOpen(false);

    } catch (err) {
      const errResponse = err.response.data !== undefined ? err.response.data.error : null;
      if (errResponse) {
        setOpenError(`Set Delivered Failed: ${errResponse}`);
        setIsOpen(false);
      } else {
        setOpenError(`Server Error: Server is probably down.`);
        setIsOpen(false);
      }
    }
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVertIcon />
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

        <MenuItem onClick={e => onRouterClick(e, `/orders/profile/${id}`)} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {!isPaid && (
          <MenuItem onClick={e => onRouterClick(e, `/orders/payment/${id}`)} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              < PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Add Payment" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        {Boolean(!delivered && ExecutivePosition.includes(position)) && (
          <MenuItem onClick={cancelOrder} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              < ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary="Cancel Order" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        
      </Menu>

      {openError !== null && (
        <OrderDialog
          open={openError}
          setOpen={value => setOpenError(value)}
        />
      )}

      {openSuccess !== null && (
        <OrderDialog 
          open={openSuccess}
          setOpen={value => setOpenSuccess(value)}
        />
      )}
    </>
  );
}
