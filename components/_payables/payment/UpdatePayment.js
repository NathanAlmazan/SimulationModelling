import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ErrorDialog from '../../_orders/create/ErrorDialog';
import DialogTitle from '@mui/material/DialogTitle';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import axios from 'axios';

export default function UpdatePayment(props) {
  const { open, setOpen, transactionId, currAmount, accessToken, reload } = props;
  const [payment, setPayment] = React.useState("");
  const [errorDialog, setErrorDialog] = React.useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentSubmit = async (event) => {
    const baseURL = API_CLIENT_SIDE();
    const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `JWT ${accessToken}`,
        }
      };

    const amount = parseFloat(payment);

    if (isNaN(amount)) {
      setErrorDialog(`Input Error: Not a number.`);
    }

    const transaction = {
        amount_paid: amount
    }

    const body = JSON.stringify({ paymentInfo: transaction });

    console.log(body);
    try {
        const response = await axios.post(`${baseURL}/payables/payment/update/${transactionId}`, body, config);
        const data = response.data.data;
        console.log(data);
        reload();
    } catch (err) {
        const errorMessage = err.response.data.error;
        setErrorDialog(`Server Error: ${errorMessage}`);
    }
      
  }

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Current recorded amount is {currAmount}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Update Payment"
            type="number"
            value={payment}
            onChange={event => setPayment(event.target.value)}
            inputProps={{ step: ".25", min: 0 }}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePaymentSubmit}>Update</Button>
        </DialogActions>

        {
          errorDialog !== null && (
            <ErrorDialog 
              open={errorDialog} 
              setOpen={value => setErrorDialog(value)} 
            />
          )
        }
      </Dialog>
  );
}
