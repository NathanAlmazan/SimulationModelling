// material
import { Grid, TextField, InputAdornment, IconButton, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
// ----------------------------------------------------------------------

const paymentType = [
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit", label: "Credit" },
]

export default function RegisterPurchase(props) {
    const { setOpenSupplier, selectedSupplier, orderForm, orderErrors, setOrderForm, setOrderErrors, editable } = props;

    const handlePaymentChange = (event) => {
        setOrderForm({ ...orderForm, [event.target.name]: event.target.value });
    }

    const handleDateChange = (event) => {
        var interval = orderForm.terms;
        const inputDate = new Date(event.target.value).toISOString();
        let dueDate = new Date(event.target.value);
        dueDate.setDate(dueDate.getDate() + interval);
        setOrderForm({ ...orderForm, purchase_date: inputDate, due_date: dueDate.toISOString() });
    }

    const handleValueChange = (event) => {
      if (event.target.value !== "") {
        const parsedValue = parseFloat(event.target.value);
        if (isNaN(parsedValue)) setOrderErrors({ ...orderErrors, [event.target.name]: "Please type a valid number." });
        else setOrderForm({ ...orderForm, [event.target.name]: parsedValue });
      } else setOrderForm({ ...orderForm, [event.target.name]: null });
    }

    const handleTermsChange = (event) => {
        if (event.target.value !== "") {
          const parsedValue = parseInt(event.target.value);
          if (isNaN(parsedValue)) setOrderErrors({ ...orderErrors, terms: "Please type a valid number." });
          else if (parsedValue > 90) setOrderErrors({ ...orderErrors, terms: "Maximum of 90 days terms." });
          else  {
              let dueDate = new Date(orderForm.purchase_date);
              dueDate.setDate(dueDate.getDate() + parsedValue);
              setOrderForm({ ...orderForm, terms: parsedValue, due_date: dueDate.toISOString() });
              setOrderErrors({ ...orderErrors, terms: null });
            }
        } else setOrderForm({ ...orderForm, [event.target.name]: null });
    }


  return (
      <>
        <Grid container spacing={3} justifyContent="space-between" alignItems="flex-start" direction="row">
            <Grid item xs={12} sm ={6} md={6} >
                <Grid container spacing={3} direction="column">
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            fullWidth
                            disabled={editable}
                            value={selectedSupplier !== null ? selectedSupplier.full_name : ""}
                            label="Supplier"
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton edge="end" onClick={() => setOpenSupplier(true)} >
                                        <PersonIcon />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            fullWidth
                            disabled={editable}
                            name="invoiceId"
                            type="number"
                            inputProps={{ step: "1", min: 0 }}
                            value={orderForm.invoiceId}
                            onChange={handlePaymentChange}
                            label="Invoice ID"
            
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={2} direction="row" justifyContent="space-between">
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Payment Type"
                                    name="payment_type"
                                    value={orderForm.payment_type}
                                    onChange={handlePaymentChange}
                                    >
                                    {paymentType.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Terms"
                                    name="terms"
                                    type="number"
                                    disabled={orderForm.payment_type !== "Credit" ? true : false}
                                    inputProps={{ min: 0 }}
                                    value={orderForm.terms}
                                    onChange={handleTermsChange}
                                    error={Boolean(orderErrors.terms !== null)}
                                    helperText={orderErrors.terms !== null && orderErrors.terms}
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
                                    type="Date"
                                    name="purchase_date"
                                    label="Purchase Date"
                                    value={new Date(orderForm.purchase_date).toJSON().slice(0,10)}
                                    onChange={handleDateChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    type="Date"
                                    name="due_date"
                                    label="Due Date"
                                    value={new Date(orderForm.due_date).toJSON().slice(0,10)}
                                />
                            </Grid>
                        </Grid> 
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={2} direction="row" justifyContent="space-between">
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Additional Charges (₱)"
                                    name="addCharge"
                                    type="number"
                                    inputProps={{ step: ".01", min: 0 }}
                                    value={orderForm.addCharge}
                                    onChange={handleValueChange}
                                    error={Boolean(orderErrors.add_charge !== null)}
                                    helperText={orderErrors.add_charge !== null && orderErrors.add_charge}
                                    />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Discount (₱)"
                                    name="discount"
                                    inputProps={{ step: ".50", min: 0 }}
                                    type="number"
                                    value={orderForm.discount}
                                    onChange={handleValueChange}
                                    error={Boolean(orderErrors.discount !== null)}
                                    helperText={orderErrors.discount !== null && orderErrors.discount}
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
