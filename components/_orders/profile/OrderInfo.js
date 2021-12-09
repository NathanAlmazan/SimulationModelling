// material
import { Grid, TextField, InputAdornment } from '@mui/material';
import { sentenceCase } from 'change-case';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
// ----------------------------------------------------------------------

const paymentType = [
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit", label: "Credit" },
]

export default function RegisterOrder({ orderInfo }) {
    const { id, customerName, agentName, payment_type, terms, order_date, due_date, vat, discount } = orderInfo;
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

  return (
      <>
        <Grid container spacing={3} justifyContent="space-between" alignItems="flex-start" direction="row">
            <Grid item xs={12} sm ={6} md={6} >
                <Grid container spacing={3} direction="column">
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            fullWidth
                            value={id}
                            label="Invoice ID"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            fullWidth
                            value={customerName}
                            label="Customer"
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <PersonIcon />
                                  </InputAdornment>
                                )
                              }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                         <TextField
                            fullWidth
                            value={agentName}
                            label="Sales Agent"
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end" >
                                    <AccountCircleIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
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
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={2} direction="row" justifyContent="space-between">
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    name="order_date"
                                    label="Order Date"
                                    value={new Date(order_date).toLocaleDateString(undefined, dateOptions)}
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
                                    label="VAT ( % )"
                                    name="vat"
                                    value={vat} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Discount in Peso"
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
