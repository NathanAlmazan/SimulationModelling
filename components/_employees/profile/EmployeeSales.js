import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import dynamic from "next/dynamic";

const EmployeeToolbar = dynamic(() => import("./EmployeeToolbar"));
const CustomerListHead = dynamic(() => import('../../_customers/profile/CustomerListHead'));
const Scrollbar = dynamic(() => import("../../Scrollbar"));
const EmployeeRow = dynamic(() => import("./EmployeeRow"));
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

const headLabel = [
  { id: 'id', label: ' ', alignRight: true },
  { id: 'customer', label: 'Customer', alignRight: true },
  { id: 'order_date', label: 'Order Date', alignRight: true },
  { id: 'due_date', label: 'Due Date', alignRight: true },
  { id: 'order_balance', label: 'Balance', alignRight: true },
  { id: 'days_left', label: 'Status', alignRight: true },
  { id: '' }
]


export default function ArchivedListTable(props) {
    const { token, orders, changeYear, year, position } = props;
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [initialOrders, setInitialOrders] = useState(orders);
    const [filterObject, setFilterObject] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('order_date');
    const [emptyRows, setEmptyRows] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState("Order ID");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
      setInitialOrders(state => orders);
    }, [orders])

    useEffect(() => {
      if (orderBy === 'customer' || orderBy === 'employee') {
        const filtered = applySortFilter(initialOrders, nameComparator(order, orderBy), filterObject, selectedFilter);
        setFilteredOrders(filtered);
      } else {
        const filtered = applySortFilter(initialOrders, getComparator(order, orderBy), filterObject, selectedFilter);
        setFilteredOrders(filtered);
      }
    }, [initialOrders, order, orderBy, filterObject, selectedFilter]);

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
        <Card sx={{ p: 3 }}>
          <Scrollbar>
            <EmployeeToolbar
                filterName={filterObject} 
                onFilterName={value => setFilterObject(value)}
                selected={selectedFilter}
                setSelected={value => setSelectedFilter(value)}
                changeYear={(event, value) => changeYear(event, value)}
                year={year}
            />
          </Scrollbar>
            <Scrollbar>
                <Table style={{ minWidth: 900 }}>
                    <CustomerListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={headLabel}
                        onRequestSort={handleRequestSort}
                    />

                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <EmployeeRow key={row.id} data={row} token={token} position={position} />
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
                      No Sales Found
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

