import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function PaymentForm(props) {
    const { orderId, customer, agent, setOpenAgent, selectedAgent, amount, setAmount, amountBlur, submit } = props;
    return (
        <Card sx={{ p: 5 }}>
            <Stack component="form" onSubmit={event => submit(event)} direction="column" spacing={3}>
                <TextField 
                    fullWidth
                    disabled={true}
                    value={orderId}
                    label="Invoice ID"
                    type="number"
                />

                <TextField 
                    fullWidth
                    disabled={true}
                    label="Customer"
                    value={customer.full_name}
                />

                <TextField 
                    fullWidth
                    required
                    label="Collector"
                    value={selectedAgent !== null ? selectedAgent.full_name : agent.full_name}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" onClick={() => setOpenAgent(true)}>
                            <IconButton edge="end">
                                <AccountCircleIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
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
                    Submit Payment
                </Button>
            </Stack>
            
        </Card>
    )
}

export default PaymentForm
