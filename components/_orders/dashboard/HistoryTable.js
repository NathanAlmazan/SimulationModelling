import React from 'react'
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';

function HistoryTable(props) {
    const { transactions, open, amountDue } = props;
    let totalPaid = 0;
    transactions.forEach((transaction) => {
        totalPaid += transaction.amount_paid;
    });

    return (
        <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Payment History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell align="right">Transaction ID</TableCell>
                    <TableCell align="right">Collector</TableCell>
                    <TableCell align="right">Amount Paid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {transactions.map((row) => {
                    const { id, employee, amount_paid, payment_date } = row;
                    const paymentDate = new Date(payment_date);

                    return (
                    <TableRow
                    key={id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {paymentDate.toDateString()}
                    </TableCell>
                    <TableCell align="right">{id}</TableCell>
                    <TableCell align="right">{employee.full_name}</TableCell>
                    <TableCell align="right">{"₱ " + amount_paid.toFixed(2)}</TableCell>
                    </TableRow>
                )}
                )}

                {transactions.length !== 0 ? (
                    <>
                    <TableRow>
                        <TableCell rowSpan={2} />
                        <TableCell colSpan={2} align="right"><strong>Amount Due</strong></TableCell>
                        <TableCell align="right">
                            {"₱ " + amountDue.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} align="right"><strong>Total Amount Paid</strong></TableCell>
                        <TableCell align="right">{"₱ " + totalPaid.toFixed(2)}</TableCell>
                    </TableRow>
                </>
                ) : (
                    <TableRow>
                        <TableCell colSpan={4}>No recorded transactions.</TableCell>
                    </TableRow>
                )}
                    
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    )
}

export default HistoryTable
