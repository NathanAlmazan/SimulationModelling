import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import axios from 'axios';
import API_CLIENT_SIDE from '../../layouts/APIConfig';
import dynamic from "next/dynamic";

const TransactionToolbar = dynamic(() => import('./TransactionToolbar'));
const TransactionListHead = dynamic(() => import('./TransactionListHead'));
const TransactionRow = dynamic(() => import('./TransactionRow'));
const Scrollbar = dynamic(() => import("../Scrollbar"));
const OrderListPagination = dynamic(() => import("../_orders/dashboard/OrderListPagination"));

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function descendingNames(a, b, orderBy) {
    if (b[orderBy].full_name < a[orderBy].full_name) {
        return -1;
    }
    if (b[orderBy].full_name > a[orderBy].full_name) {
        return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function nameComparator(order, orderBy) {
    return order === 'desc'
    ? (a, b) => descendingNames(a, b, orderBy)
    : (a, b) => -descendingNames(a, b, orderBy);
  }
  
  function applySortFilter(array, comparator, query, filterBy) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      switch (filterBy) {
        case "Invoice":
          return filter(array, (_order) => _order.invoice_id.indexOf(query) !== -1);
        case "Supplier":
          return filter(array, (_order) => _order.supplier.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        default: 
          return array.filter(order => order.id === parseInt(query));
      }
    }
    return stabilizedThis.map((el) => el[0]);
}


export default function TransactionListTable(props) {
    const { token, redirect } = props;
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [actualOrders, setActualOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('payment_date');
    const [emptyRows, setEmptyRows] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
    const [selectedRange, setSelectedRange] = useState("WEEK");

    useEffect(() => {
      async function fetchOrdersByDueDate() {
        const baseURL = API_CLIENT_SIDE();
  
        try {
          const response = await axios({
            url: `${baseURL}/sales/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
            },
            data: {
            query: `
                query GetTransactions ($range: DateRanges!, $date: DateTime!) {
                  showTransactions (date_range: $range, date_selected: $date) {
                    id
                    account {
                      employee {
                        full_name
                      }
                    }
                    order {
                      id
                      receipt_file
                    }
                    amount_paid
                    payment_date
                  }
                }
            `,
            variables: {
              range: selectedRange, 
              date: selectedDate
            }
              }
          });

          const response2 = await axios({
            url: `${baseURL}/payables/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
            },
            data: {
            query: `
              query GetPayables ($range: DateRanges!, $date: DateTime!) {
                showPayables (date_range: $range, date_selected: $date) {
                  id
                  account {
                    employee {
                      full_name
                    }
                  }
                  purchase_order {
                    invoice_id
                  }
                  receipt_file
                  amount_paid
                  payment_date
                }
              }
            `,
            variables: {
              range: selectedRange, 
              date: selectedDate
            }
              }
          });
  
        const filteredTransactions = response.data.data;
        const filteredPayments = response2.data.data;
        const transactionList = filteredTransactions.showTransactions.concat(filteredPayments.showPayables);

        setActualOrders(state => transactionList);
  
        } catch (err) {
          if (err.response.data.error === "Invalid Token") {
            console.log(err.response);
          } else {
            console.log(err.response);
          }
        }
      }
     
      fetchOrdersByDueDate();

    }, [token, redirect, selectedDate, selectedRange]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
      if (orderBy === 'supplier') {
        const filtered = applySortFilter(actualOrders, nameComparator(order, orderBy), null, null);
        setFilteredOrders(filtered);
      } else {
        const filtered = applySortFilter(actualOrders, getComparator(order, orderBy), null, null);
        setFilteredOrders(filtered);
      }
    }, [actualOrders, order, orderBy]);

    useEffect(() => {
      const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length) : 0;
      setEmptyRows(emptyRows);
    }, [page, rowsPerPage, filteredOrders])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDate = (event) => {
      setSelectedDate(new Date(event.target.value).toISOString());
    }

    return (
        <Card sx={{ p: 5 }}>
          <Scrollbar>
            <TransactionToolbar
                selectedDate={selectedDate}
                selectedRange={selectedRange}
                onDateChange={event => handleChangeDate(event)}
                onRangeChange={event => setSelectedRange(event.target.value)}
            />
          </Scrollbar>
          
            <Scrollbar>
                <Table style={{ minWidth: 900 }}>
                    <TransactionListHead
                        order={order}
                        orderBy={orderBy}
                        rowCount={filteredOrders.length}
                        hideCheckbox={true}
                        numSelected={0}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={() => setSelected([])}
                    />

                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TransactionRow key={row.id} data={row} token={token} redirect={(event, path) => redirect(event, path)}/>
                    ))}
                    {emptyRows > 0 && filteredOrders.length !== 0 && (
                    <TableRow style={{ height: 60 * emptyRows }}>
                      <TableCell colSpan={10} />
                    </TableRow>
                    )}
                </TableBody>

                {filteredOrders.length === 0 && (
                  <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                      No Purchase Found
                    </TableCell>
                  </TableRow>
                </TableBody>
                )}

                </Table>
            </Scrollbar>
            
            <OrderListPagination 
                count={filteredOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                handleChangePage={(event, newPage) => handleChangePage(event, newPage)}
                handleChangeRowsPerPage={event => handleChangeRowsPerPage(event)}
            />

        </Card>
    )
}

