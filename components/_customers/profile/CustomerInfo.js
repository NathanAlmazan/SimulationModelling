import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function CustomerInfo(props) {
    const { customer } = props;
    return (
        <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                    fullWidth
                    variant="standard"
                    label="First name"
                    value={customer.first_name}
                />

                <TextField
                    fullWidth
                    variant="standard"
                    label="Last name"
                    value={customer.last_name}
                />
                </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                    fullWidth
                    variant="standard"
                    label="Cellphone Number"
                    value={customer.contact_number !== null ? customer.contact_number : ""}
                />

                <TextField
                    fullWidth
                    variant="standard"
                    label="Email"
                    value={customer.email !== null ? customer.email : ""}
                />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                    fullWidth
                    variant="standard"
                    label="Company Name"
                    value={customer.company_name !== null ? customer.company_name : ""}
                />

                <TextField
                    fullWidth
                    variant="standard"
                    label="Website"
                    value={customer.website !== null ? customer.website : ""}
                />
            </Stack>

                <TextField
                    fullWidth
                    variant="standard"
                    label="Address"
                    value={customer.address !== null ? customer.address : ""}
                />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                    fullWidth
                    variant="standard"
                    label="City"
                    value={customer.city}
                />

                <TextField
                    fullWidth
                    variant="standard"
                    label="Province"
                    value={customer.province}
                />
            </Stack>

        </Stack>
    )
}

export default CustomerInfo
