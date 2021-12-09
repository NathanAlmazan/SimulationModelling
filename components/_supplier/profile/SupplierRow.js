import React from 'react';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import dynamic from "next/dynamic";

const PurchaseMoreMenu = dynamic(() => import("../../_payables/dashboard/PurchaseMoreMenu"));
const Label = dynamic(() => import("../../Label"));

function SupplierRow({ data, token }) {
    const { id, invoice_id, purchase_date, due_date, purchase_balance, days_left, delivered, total_amount } = data;
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const isPaid = Boolean(purchase_balance <= 0);
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
            <TableCell align="right">{invoice_id !== null ? invoice_id : "Unspecified"}</TableCell>
            <TableCell align="right">{new Date(purchase_date).toLocaleDateString(undefined, options)}</TableCell>
            <TableCell align="right">{new Date(due_date).toLocaleDateString(undefined, options)}</TableCell>
            <TableCell align="right">{purchase_balance > 0 ? "₱" + purchase_balance.toFixed(2) : "₱ 0.00"}</TableCell>
            <TableCell align="right">
            <Label
                variant="ghost"
                color={days_left < 2 && !isPaid ? 'error' : (days_left < 10 && !isPaid ? 'warning' : 'success')}
            >
                {isPaid ? "Fulfilled" : (!overDue ? `${parseInt(days_left)} days left` : `${Math.abs(parseInt(days_left))} days overdue`)}
            </Label>
            </TableCell>

            <TableCell align="right">
            <PurchaseMoreMenu
                id={id}
                token={token} 
                delivered={delivered}
                isPaid={isPaid}
            />
            </TableCell>
        </TableRow>
        </>
    )
}

export default SupplierRow
