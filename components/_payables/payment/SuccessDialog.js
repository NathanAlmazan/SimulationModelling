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
  const { open, setOpen, leavePage, uploadReceipt } = props;

  const handleClose = () => {
    setOpen(null);
    leavePage();
  };

  return (
      <Dialog
        open={open !== null ? true : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Payment Success!</DialogTitle>
        <DialogContent>
            {open > 0 ? (
                <DialogContentText id="alert-dialog-slide-description">
                    This order has remaining balance of ₱ {open.toFixed(2)}.
                </DialogContentText>
            ) : (
                <DialogContentText id="alert-dialog-slide-description">
                    This order is now completely paid.
                </DialogContentText>
            )}
         
        </DialogContent>
        <DialogActions>
          <Button component="label" sx={{ m: 2 }}>
              Upload Receipt
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, application/pdf"
                onChange={event => uploadReceipt(event)}
                hidden 
            />
            </Button>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
  );
}
