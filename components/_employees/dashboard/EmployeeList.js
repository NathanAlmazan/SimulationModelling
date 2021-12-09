import React from 'react';
import Grid from '@mui/material/Grid';
import EmployeeCard from './EmployeeCard';

function EmployeeList(props) {
    const { employees } = props;
    return (
        <Grid container direction="row" spacing={3}>
            {employees.map((employee) => (
                <Grid key={employee.id} item xs={12} sm={4} md={3}>
                    <EmployeeCard employee={employee} />
                </Grid>
            ))}
        </Grid>
    )
}

export default EmployeeList
