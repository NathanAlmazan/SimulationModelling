import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import axios from 'axios';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import dynamic from "next/dynamic";

const ArchivedListToolbar = dynamic(() => import('./ArchivedListToolbar'));
const PurchasedListHead = dynamic(() => import('./PurchasedListHead'));
const PurchasedListRow = dynamic(() => import('./PurchasedListRow'));
const Scrollbar = dynamic(() => import("../../Scrollbar"));
const OrderListPagination = dynamic(() => import("../../_orders/dashboard/OrderListPagination"));

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


export default function OverdueListTable(props) {
    const { token, redirect } = props;
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [initialOrders, setInitialOrders] = useState([]);
    const [actualOrders, setActualOrders] = useState([]);
    const [filterObject, setFilterObject] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [emptyRows, setEmptyRows] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState("Invoice");

    useEffect(() => {
      async function fetchOrdersByDueDate() {
        const baseURL = API_CLIENT_SIDE();
  
        try {
          const response = await axios({
            url: `${baseURL}/payables/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
            },
            data: {
            query: `
                query PurchasedByDueDate {
                    purchasedOrderOverdue {
                        id 
                        supplier {
                            id
                            full_name
                        }
                        purchase_date
                        invoice_id
                        delivered
                        due_date
                        purchase_balance
                        total_amount
                        days_left
                        payment_history {
                          id
                          amount_paid    
                          payment_date
                      }
                    }
                }
            `,
              }
          });
  
        const filteredOrders = response.data.data;

        setInitialOrders(state => filteredOrders.purchasedOrderOverdue);
        setActualOrders(state => filteredOrders.purchasedOrderOverdue);
  
        } catch (err) {
          if (err.response.data.error === "Invalid Token") {
            redirect(null, "/signin");
          } else {
            console.log(err);
          }
        }
      }
     
        fetchOrdersByDueDate();

    }, [token, redirect]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
      if (orderBy === 'supplier') {
        const filtered = applySortFilter(actualOrders, nameComparator(order, orderBy), filterObject, selectedFilter);
        setFilteredOrders(filtered);
      } else {
        const filtered = applySortFilter(actualOrders, getComparator(order, orderBy), filterObject, selectedFilter);
        setFilteredOrders(filtered);
      }
    }, [actualOrders, order, orderBy, filterObject, selectedFilter]);

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

    return (
        <Card>
            <ArchivedListToolbar
                numSelected={0} 
                filterName={filterObject} 
                onFilterName={value => setFilterObject(value)}
                selected={selectedFilter}
                setSelected={value => setSelectedFilter(value)}
            />

            <Scrollbar>
                <Table style={{ minWidth: 1200 }}>
                    <PurchasedListHead
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
                      <PurchasedListRow key={row.id} data={row} token={token}/>
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

