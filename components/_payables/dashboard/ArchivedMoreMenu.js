import { useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axios from 'axios';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import dynamic from "next/dynamic";

const OrderDialog = dynamic(() => import('../../_orders/dashboard/ErrorDialog'));

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const { id, token, purpose, refreshData } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openError, setOpenError] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(null);
  const history = useRouter();

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

  const deleteOrder = async () => {
    try {
      await axios.get(`${baseURL}/payables/delete/${id}`, config);
      setIsOpen(false);
      refreshData();

    } catch (err) {
        const errResponse = err.response.data !== undefined ? err.response.data.error : null;
      if (errResponse !== null) {
        setOpenError(`Delete Failed: ${errResponse}`);
        setIsOpen(false);
      } else {
        setOpenError(`Server Error: Server is probably down.`);
        setIsOpen(false);
      }
    }

  }

  const restoreOrder = async () => {
    try {
      await axios.get(`${baseURL}/payables/restore/${id}`, config);
      setIsOpen(false);
      refreshData();

    } catch (err) {
      const errResponse = err.response.data !== undefined ? err.response.data.error : null;
      if (errResponse !== null) {
        setOpenError(`Restore Failed: ${errResponse}`);
        setIsOpen(false);
      } else {
        setOpenError(`Server Error: Server is probably down.`);
        setIsOpen(false);
      }
    }
  }

  const deliverOrder = async () => {
    try {
      await axios.get(`${baseURL}/payables/delivered/${id}`, config);
      setIsOpen(false);
      refreshData();

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
        {purpose === "overdue" && (
          <MenuItem onClick={e => onRouterClick(e, `orders/payment/${id}`)} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              < PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Add Payment" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        {purpose === "delivery" && (
          <MenuItem onClick={deliverOrder} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              < DeliveryDiningIcon />
            </ListItemIcon>
            <ListItemText primary="Arrived" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        {purpose === "restore" && (
            <>
            <MenuItem onClick={restoreOrder} sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                    < RestorePageIcon />
                </ListItemIcon>
                <ListItemText primary="Restore" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>

            <MenuItem onClick={deleteOrder} sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                < DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
            </>
        )}

        <MenuItem onClick={e => onRouterClick(e, `/purchase/profile/${id}`)} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      
        
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
