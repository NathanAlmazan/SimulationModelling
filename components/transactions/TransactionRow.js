import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TopicIcon from '@mui/icons-material/Topic';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import dynamic from "next/dynamic";

const Label = dynamic(() => import("../Label"));

function TransactionRow({ data, token, redirect }) {
    const { id, account, amount_paid, payment_date, order, purchase_order } = data;
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    const handleViewOrder = (event) => {
        if (!purchase_order) {
            redirect(event, "/orders/profile/" + order.id);
        } else {
            redirect(event, "/purchase/profile/" + purchase_order.id);
        }
    }

    return (

        <TableRow
            hover
        >
            <TableCell component="th" scope="row" padding="none" align="center">
                <Typography variant="subtitle2" noWrap>
                {id}
                </Typography>
            </TableCell>
            <TableCell align="right">{!purchase_order ? order.id : purchase_order.invoice_id}</TableCell>
            <TableCell align="right">{account.employee.full_name}</TableCell>
            <TableCell align="right">{new Date(payment_date).toLocaleDateString(undefined, options)}</TableCell>
            {!purchase_order ? (
                <TableCell align="right" sx={{ color: "green" }}>{"+ ₱" + amount_paid.toFixed(2)}</TableCell>
            ) : (
                <TableCell align="right" sx={{ color: "red" }}>{"- ₱" + amount_paid.toFixed(2)}</TableCell>
            )}
            
            <TableCell align="right">
            <Label
                variant="ghost"
                color={!purchase_order ? "success" : "error"}
            >
                {!purchase_order ? "receivables" : "payables"}
            </Label>
            </TableCell>

            <TableCell align="right">
            <IconButton onClick={event => handleViewOrder(event)}>
                <TopicIcon/>
            </IconButton>
            </TableCell>
        </TableRow>

    )
}

export default TransactionRow
