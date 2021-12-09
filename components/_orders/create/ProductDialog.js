import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogTitle from '@mui/material/DialogTitle';
import dynamic from "next/dynamic";

const ProductWindow = dynamic(() => import("./ProductWindow"));

export default function ProductDialog(props) {
  const { open, setOpen, setOrders, orderProducts, products, categories } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <Dialog
        fullWidth={true}
        fullScreen={true}
        maxWidth="lg"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Select Products</DialogTitle>
        <DialogContent>
          
            <ProductWindow selectedProducts={orderProducts} setSelected={value => setOrders(value)} allProducts={products} allCategories={categories} />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Finish</Button>
        </DialogActions>
      </Dialog>
  );
}
