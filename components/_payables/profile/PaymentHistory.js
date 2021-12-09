import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Scrollbar from '../../Scrollbar';
import UpdatePayment from '../payment/UpdatePayment';
import Card from '@mui/material/Card'

export default function PaymentHistory(props) {
  const [update, setUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState({ 
    id: null,
    curr_amount: null
  })
  const { transactions, balance, amountDue, uploadReceipt, viewReceipt, token, reload } = props;
  let totalPaid = 0;
  transactions.forEach((transaction) => {
      totalPaid += transaction.amount_paid;
  });

  const handleUpdatePayment = (paymentId, amount) => {
    setSelectedRow({ ...selectedRow, id: paymentId, curr_amount: amount });
    setUpdate(true);
  }

  return (
    <Card sx={{ p: 5 }}>
      <CardHeader 
        title="Payment History" 
      />
    <Scrollbar>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Payment Date</TableCell>
            <TableCell align="right">Payment ID</TableCell>
            <TableCell align="right">Amount Paid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => {
              const { id, amount_paid, payment_date, receipt_file } = row;
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
              <TableCell align="right">{"₱ " + amount_paid.toFixed(2)}</TableCell>
              <TableCell align="right">
                <Stack direction="row" alignItems="center">
                  {receipt_file !== null ? (
                    <IconButton onClick={event => viewReceipt(event, receipt_file)}>
                        <DownloadIcon />
                    </IconButton>
                  ) : (
                    <IconButton component="label">
                        <FileUploadIcon />
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg, application/pdf"
                          onChange={event => uploadReceipt(event, id)}
                          hidden 
                        />
                    </IconButton>
                  )}
                  <IconButton onClick={event => handleUpdatePayment(id, amount_paid)}>
                      <EditIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          )}
          )}

          {transactions.length !== 0 ? (
              <>
                <TableRow>
                    <TableCell rowSpan={1} />
                    <TableCell colSpan={1} align="right"><strong>Amount Due</strong></TableCell>
                    <TableCell align="right">
                        {"₱ " + amountDue.toFixed(2)}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2} align="right"><strong>Total Amount Paid</strong></TableCell>
                    <TableCell align="right">{"₱ " + totalPaid.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    {balance <= 0 ? (
                      <>
                      <TableCell colSpan={2} align="right">
                        <strong>Change</strong>
                      </TableCell>
                      <TableCell align="right">
                        {"₱ " + Math.abs(balance).toFixed(2)}
                      </TableCell>
                      </>
                    ) : (
                      <>
                      <TableCell colSpan={2} align="right">
                        <strong>Balance</strong>
                      </TableCell>
                      <TableCell align="right">
                        {"₱ " + balance.toFixed(2)}
                      </TableCell>
                      </>
                    )}
                </TableRow>
            </>
          ) : (
            <TableRow>
                <TableCell colSpan={4}>No recorded payments.</TableCell>
            </TableRow>
          )}
            
        </TableBody>
      </Table>
    </Scrollbar>
    {update === true && (
      <UpdatePayment 
        transactionId={selectedRow.id}
        accessToken={token}
        currAmount={"₱ " + selectedRow.curr_amount.toFixed(2)}
        open={update}
        setOpen={value => setUpdate(value)}
        reload={() => reload()}
      />
    )}
    </Card>
  );
}
