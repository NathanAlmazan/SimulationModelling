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
  const { open, redirect, orderId, update, uploadInvoice } = props;

  const handleClose = () => {
    redirect("/purchase");
  };

  const handleAddPayment = () => {
      redirect(`/purchase/payment/${orderId}`);
  }

  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{!update ? "Purchased Order was recorded successfully" : "Purchased Order was updated successfully"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You can upload invoice in PDF or image format by clicking <strong>Upload Invoice</strong>. 
              You can also record payments by clicking <strong>Record Payment</strong>. 
              Click <strong>View Purchased</strong> to view active purchased orders.
            </DialogContentText>
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
                component="label"
                sx={{ m: 2 }}
            >
                Upload Invoice
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  onChange={event => uploadInvoice(event)}
                  hidden 
              />
            </Button>
          
        </DialogActions>
      </Dialog>
  );
}
