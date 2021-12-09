import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const { open, redirect, orderId, generateInvoice, update } = props;

  const handleClose = () => {
    redirect("/orders");
  };

  const handleAddPayment = () => {
      redirect(`/orders/payment/${orderId}`);
  }

  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{!update ? "Order was placed successfully" : "Order was updated successfully"}</DialogTitle>
        <DialogContent>
          {!update ? (
            <DialogContentText id="alert-dialog-slide-description">
              The order was given an invoice ID of <strong>{orderId}</strong>. 
              You can generate a PDF invoice by clicking <strong>Generate Invoice</strong> and 
              you can also record payment by clicking <strong>Record Payment</strong>. 
              Click <strong>View Orders</strong> to view active orders.
            </DialogContentText>
          ): (
            <DialogContentText id="alert-dialog-slide-description">
              You can generate a PDF invoice by clicking <strong>Generate Invoice</strong> and 
              you can also record payment by clicking <strong>Record Payment</strong>. 
              Click <strong>View Orders</strong> to view active orders.
            </DialogContentText>
          )}
          
        </DialogContent>
        <DialogActions>
            <Button 
                fullWidth
                onClick={handleClose}
            >
                Okay
            </Button>
            <Button 
                fullWidth
                onClick={handleAddPayment}
            >
                Record Payment
            </Button>

            <Button 
                fullWidth
                onClick={() => generateInvoice()}
            >
                Generate Invoice
            </Button>
        </DialogActions>
      </Dialog>
  );
}
