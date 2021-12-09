import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';
import { headerCase } from 'change-case';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

export default function EmployeeInfo(props) {
    const { employee, setImage, imageURL } = props;
    const baseURL = API_CLIENT_SIDE();
    return (
        <Card sx={{ p: 5 }}>
            <Grid container direction="row" justifyContent="space-between" spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" spacing={3}>
                        <Avatar
                            alt={employee.full_name}
                            src={imageURL !== null ? imageURL : "https://drive.google.com/uc?id=13cTZcKxY3MmZLO1ZxU0RLyZeDt9Qfzmf&export=download"}
                            sx={{ width: 240, height: 240, alignSelf: 'center' }}
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
                                {headerCase(employee.position)}
                            </Typography>
                        </Stack>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageSearchTwoToneIcon />}
                        >
                            Change Image
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={event => setImage(event)}
                                hidden 
                            />
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <Grid container spacing={3} direction="column">
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField 
                                fullWidth
                                label="Email"
                                value={employee.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Stack direction="row" spacing={2} justifyContent="space-between">
                            <TextField 
                                fullWidth
                                label="Contact Number"
                                value={employee.contact_number}
                            />
                            <TextField 
                                fullWidth
                                label="Zip Code"
                                value="1113"
                            />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField 
                                fullWidth
                                label="Address"
                                value={employee.address}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Stack direction="row" spacing={2} justifyContent="space-between">
                            <TextField 
                                fullWidth
                                label="City"
                                value={employee.city}
                            />
                            <TextField 
                                fullWidth
                                label="Province"
                                value={employee.province}
                            />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}
