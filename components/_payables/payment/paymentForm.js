import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

function PaymentForm(props) {
    const { orderInvoice, supplier, amount, setAmount, amountBlur, submit } = props;
    return (
        <Card sx={{ p: 5 }}>
            <Stack component="form" onSubmit={event => submit(event)} direction="column" spacing={3}>
                <TextField 
                    fullWidth
                    disabled={true}
                    value={orderInvoice}
                    label="Invoice ID"
                    type="number"
                />

                <TextField 
                    fullWidth
                    disabled={true}
                    label="Supplier"
                    value={supplier.full_name}
                />

                <TextField 
                    fullWidth
                    required
                    label="Amount Paid"
                    inputProps={{ step: ".05", min: 0 }}
                    type="number"
                    value={amount}
                    onChange={(event) => setAmount(event)}
                    onBlur={event => amountBlur(event)}
                />

                <Button
                    variant="contained"
                    type="submit"
                    >
                    Record Payment
                </Button>
            </Stack>
            
        </Card>
    )
}

export default PaymentForm
