// material
import { Grid, TextField, InputAdornment } from '@mui/material';
import { sentenceCase } from 'change-case';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
// ----------------------------------------------------------------------

export default function RegisterOrder({ orderInfo }) {
    const { id, supplierName, payment_type, terms, purchase_date, due_date, add_charge, discount, invoice_id } = orderInfo;
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

  return (
      <>
        <Grid container spacing={3} justifyContent="space-between" alignItems="flex-start" direction="row">
            <Grid item xs={12} sm ={6} md={6} >
                <Grid container spacing={3} direction="column">
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            fullWidth
                            value={invoice_id !== null ? invoice_id : "Unspecified"}
                            label="Invoice ID"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                         <TextField
                            fullWidth
                            value={supplierName}
                            label="Supplier Name"
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end" >
                                    <AccountCircleIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={2} direction="row" justifyContent="space-between">
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Payment Type"
                                    name="payment_type"
                                    value={sentenceCase(payment_type)}
                                    />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Terms"
                                    name="terms"
                                    value={terms}
                                />
                            </Grid>
                        </Grid> 
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm ={6} md={6} >
                <Grid container spacing={3} direction="column">
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={2} direction="row" justifyContent="space-between">
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    name="order_date"
                                    label="Purchase Date"
                                    value={new Date(purchase_date).toLocaleDateString(undefined, dateOptions)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    name="due_date"
                                    label="Due Date"
                                    value={new Date(due_date).toLocaleDateString(undefined, dateOptions)}
                                />
                            </Grid>
                        </Grid> 
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={2} direction="row" justifyContent="space-between">
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Additional Charge (₱)"
                                    name="add_charge"
                                    value={add_charge} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Discount (₱)"
                                    name="discount"
                                    value={discount}
                                    />
                            </Grid>
                        </Grid> 
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </>
  );
}
