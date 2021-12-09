import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import dynamic from "next/dynamic";

const ArchivedListToolbar = dynamic(() => import('./ArchivedListToolbar'));
const ArchivedListHead = dynamic(() => import('./ArchivedListHead'));
const Scrollbar = dynamic(() => import("../../Scrollbar"));
const ArchivedMoreMenu = dynamic(() => import("./ArchivedMoreMenu"));
const Label = dynamic(() => import("../../Label"));
const OrderListPagination = dynamic(() => import("./OrderListPagination"));

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


export default function ArchivedListTable(props) {
    const { handleClick, selected, token, orders, hideCheckbox, purpose, allFunction, refreshData, clearSelected } = props;
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [initialOrders, setInitialOrders] = useState(orders);
    const [filterObject, setFilterObject] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [emptyRows, setEmptyRows] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState("Order ID");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      clearSelected([]);
    }

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
        <Card>
            <ArchivedListToolbar
                numSelected={selected.length} 
                filterName={filterObject} 
                onFilterName={value => setFilterObject(value)}
                selected={selectedFilter}
                setSelected={value => setSelectedFilter(value)}
                purpose={purpose}
                allFunction={allFunction}
            />

            <Scrollbar>
                <Table>
                    <ArchivedListHead 
                        order={order}
                        orderBy={orderBy}
                        rowCount={filteredOrders.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                        hideCheckbox={hideCheckbox}
                    />

                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        const { id, customer, employee, order_date, amount_due } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;
                        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                         
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, id)}
                              />
                            </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                          </TableCell>
                          <TableCell align="right">{customer.full_name}</TableCell>
                          <TableCell align="right">{employee.full_name}</TableCell>
                          <TableCell align="right">{new Date(order_date).toLocaleDateString(undefined, options)}</TableCell>
                          <TableCell align="right">{"₱ " + amount_due.toFixed(2)}</TableCell>
                          {purpose === "restore" ? (
                            <TableCell align="right">
                              <Label
                                variant="ghost"
                                color="error"
                              >
                                Canceled
                              </Label>
                            </TableCell>
                          ) : (
                            <TableCell align="right">
                              <Label
                                variant="ghost"
                                color="warning"
                              >
                                Shipping
                              </Label>
                            </TableCell>
                          )}

                          <TableCell align="right">
                            <ArchivedMoreMenu
                              id={id}
                              token={token} 
                              purpose={purpose}
                              refreshData={refreshData}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                      No Orders Found
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

