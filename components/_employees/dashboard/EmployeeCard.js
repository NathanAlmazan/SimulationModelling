import React from 'react';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import { useRouter } from 'next/router';

const EmployeePositions = [
    { value: "PRESIDENT", label: "President" },
    { value: "VICE_PRES", label: "Vice President" },
    { value: "MANAGER", label: "Manager" },
    { value: "ACCOUNTANT", label: "Accountant" },
    { value: "CASHIER", label: "Cashier" },
    { value: "WSTAFF", label: "Warehouse Staff" },
    { value: "DELIVERY", label: "Delivery Personnel" },
    { value: "AGENT", label: "Sales Agent" }
]

function EmployeeCard(props) {
    const baseURL = API_CLIENT_SIDE();
    const { employee } = props;
    const history = useRouter();

    return (
        <Card sx={{ p: 3 }}>
            <Stack direction="column" spacing={3}>
                <Avatar
                    alt="Remy Sharp"
                    src={employee.profile_image !== null ? employee.profile_image : "https://drive.google.com/uc?id=13cTZcKxY3MmZLO1ZxU0RLyZeDt9Qfzmf&export=download"}
                    sx={{ width: 180, height: 180, alignSelf: 'center' }}
                    onClick={() => history.push('/employees/profile/' + employee.id)}
                />
                <Stack direction="column">
                    <Typography
                        variant="h6"
                        align="center"
                    >
                        {employee.full_name}
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                    >
                        {EmployeePositions.find(obj => obj.value === employee.position).label}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "gray" }}
                        align="center"
                    >
                        {employee.contact_number}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={3}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',  }}>
                        <LoyaltyIcon color="secondary" sx={{ marginRight: 0.5, transform: "scale(0.6)" }} /> 
                        {"₱" + employee.total_sold}
                    </Typography>
                 </Stack>
            </Stack>
        </Card>
    )
}

export default EmployeeCard
