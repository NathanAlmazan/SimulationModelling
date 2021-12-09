import React from 'react';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import dynamic from "next/dynamic";

const OrderMoreMenu = dynamic(() => import("../../_orders/dashboard/OrderMoreMenu"));
const Label = dynamic(() => import("../../Label"));

function EmployeeRow({ data, token }) {
    const { id, customer, order_date, due_date, order_balance, days_left, delivered, position } = data;
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const isPaid = Boolean(order_balance <= 0);
    const overDue = Boolean(days_left < 0);

    return (
        <>
        <TableRow
            hover
        >
            <TableCell component="th" scope="row" padding="none" align="right">
                <Typography variant="subtitle2" noWrap>
                {id}
                </Typography>
            </TableCell>
            <TableCell align="right">{customer.full_name}</TableCell>
            <TableCell align="right">{new Date(order_date).toLocaleDateString(undefined, options)}</TableCell>
            <TableCell align="right">{new Date(due_date).toLocaleDateString(undefined, options)}</TableCell>
            <TableCell align="right">{order_balance > 0 ? "₱ " + order_balance.toFixed(2) : "₱ 0.00"}</TableCell>
            <TableCell align="right">
            <Label
                variant="ghost"
                color={days_left < 2 && !isPaid ? 'error' : (days_left < 10 && !isPaid ? 'warning' : 'success')}
            >
                {isPaid ? "Fulfilled" : (!overDue ? `${parseInt(days_left)} days left` : `${Math.abs(parseInt(days_left))} days overdue`)}
            </Label>
            </TableCell>

            <TableCell align="right">
            <OrderMoreMenu 
                id={id}
                token={token} 
                delivered={delivered}
                isPaid={isPaid}
                position={position}
            />
            </TableCell>
        </TableRow>
        </>
    )
}

export default EmployeeRow
