import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import dynamic from "next/dynamic";

const PurchaseMoreMenu = dynamic(() => import("./PurchaseMoreMenu"));
const PaymentHistory = dynamic(() => import("./PaymentHistory"));
const Label = dynamic(() => import("../../Label"));

function OrderListRow({ data, token, position }) {
    const [open, setOpen] = useState(false);
    const { id, supplier, purchase_date, invoice_id, due_date, purchase_balance, days_left, delivered, total_amount, payment_history } = data;
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const isPaid = Boolean(purchase_balance <= 0);
    const overDue = Boolean(days_left < 0);

    return (
        <>
        <TableRow
            hover
        >
            <TableCell padding="checkbox">
                <IconButton onClick={() => setOpen(!open)} size="small">
                    {open ? <ExpandLessIcon/> : <ExpandMoreIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row" padding="none">
                <Typography variant="subtitle2" noWrap>
                {id}
                </Typography>
            </TableCell>
            <TableCell align="right">{invoice_id !== null ? invoice_id : 'Unspecified'}</TableCell>
            <TableCell align="right">{supplier.full_name}</TableCell>
            <TableCell align="right">{!delivered ? (
                <Label
                variant="ghost"
                color="warning"
                >
                Pending...
                </Label>
                ) : (
                new Date(delivered).toLocaleDateString(undefined, options)
                )}
            
            </TableCell>
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
                position={position}
            />
            </TableCell>
        </TableRow>
        <PaymentHistory transactions={payment_history} open={open} amountDue={total_amount} />
        </>
    )
}

export default OrderListRow
