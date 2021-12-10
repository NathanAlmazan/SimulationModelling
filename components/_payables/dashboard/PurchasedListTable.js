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

const PurchaseListToolbar = dynamic(() => import('./PurchaseListToolbar'));
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
        case "Agent":
          return filter(array, (_order) => _order.employee.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        case "Customer":
          return filter(array, (_order) => _order.customer.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        default: 
          return array.filter(order => order.id === parseInt(query));
      }
    }
    return stabilizedThis.map((el) => el[0]);
}


export default function OrderListTable(props) {
    const { token, redirect, position } = props;
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
    const [selectedDate, setSelectedDate] = useState(new Date().toJSON().slice(0,10));
    const [dateRange, setDateRange] = useState("WEEK");
    const [orderDue, setOrderDue] = useState(true);

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
                query PurchasedByDueDate ($range: DateRanges!, $date: DateTime!) {
                    filteredByDueDate (date_range: $range, date_selected: $date) {
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
            variables: {
                range: dateRange,
                date: new Date(selectedDate).toISOString()
                }
              }
          });
  
        const filteredOrders = response.data.data;

        setInitialOrders(state => filteredOrders.filteredByDueDate);
        setActualOrders(state => filteredOrders.filteredByDueDate);
  
        } catch (err) {
          if (err.response.data.error === "Invalid Token") {
            redirect(null, "/signin");
          } else {
            console.log(err);
          }
        }
      }

      async function fetchOrdersByOrderDate() {
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
                query PurchasedByDueDate ($range: DateRanges!, $date: DateTime!) {
                    filteredByOrderDate (date_range: $range, date_selected: $date) {
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
            variables: {
                range: dateRange,
                date: new Date(selectedDate).toISOString()
                }
              }
          });
  
        const filteredOrders = response.data.data;

        setInitialOrders(state => filteredOrders.filteredByOrderDate);
        setActualOrders(state => filteredOrders.filteredByOrderDate);
  
        } catch (err) {
          if (err.response.data.error === "Invalid Token") {
            redirect(null, "/signin");
          } else {
            console.log(err);
          }
        }
      }

      if (orderDue === true) {
        fetchOrdersByDueDate();
      } else {
        fetchOrdersByOrderDate();
      }
      

    }, [selectedDate, dateRange, token, orderDue, redirect]);

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
      async function filterOrders() {
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
                query FilterOrderByID ($ID: Int, $Supplier: String, $Invoice: String) {
                    filterOrdersBySupplier (id: $ID, supplier_name: $Supplier, invoiceId: $Invoice) {
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
            variables: {
                ID: selectedFilter !== 'Record ID' ? null : parseInt(filterObject),
                Supplier: selectedFilter !== 'Supplier' ? null : filterObject, 
                Invoice: selectedFilter !== 'Invoice' ? null : filterObject
                }
              }
          });
  
        const filteredOrders = response.data.data;
        setActualOrders(state => filteredOrders.filterOrdersBySupplier);
  
        } catch (err) {
          if (err.response.data.error === "Invalid Token") {
            redirect(null, "/signin");
          } else {
            console.log(err.response);
          }
        }
      }

      if (filterObject.length !== 0) {
        if (selectedFilter === "Record ID") {
          if (!isNaN(filterObject)) {
            filterOrders();
          }
        } else {
          if (filterObject.length > 1) {
            filterOrders();
          }
        }
      } else {
        setFilteredOrders(state => initialOrders);
      }


    }, [filterObject, selectedFilter, redirect, token, initialOrders]);

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
          <Scrollbar>
            <PurchaseListToolbar 
                numSelected={0} 
                filterName={filterObject} 
                onFilterName={value => setFilterObject(value)}
                selectedDate={selectedDate}
                dateRange={dateRange}
                setSelectedDate={value => setSelectedDate(value)}
                setDateRange={value => setDateRange(value)}
                orderDue={orderDue}
                setOrderDue={value => setOrderDue(value)}
                selected={selectedFilter}
                setSelected={value => setSelectedFilter(value)}
            />
          </Scrollbar>
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
                      <PurchasedListRow key={row.id} data={row} token={token} position={position} />
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

