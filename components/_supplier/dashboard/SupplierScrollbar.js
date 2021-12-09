import React from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
// components
import dynamic from "next/dynamic";

const Scrollbar = dynamic(() => import("../../Scrollbar"));
const SearchNotFound = dynamic(() => import("../../SearchNotFound"));
const SupplierListHead = dynamic(() => import('./SupplierListHead'));
const SupplierBody = dynamic(() => import('./SupplierBody'));

function SupplierScrollbar(props) {
    const { order, orderBy, headLabel, rowCount, numSelected, onRequestSort, onSelectAllClick, suppliers, userNotFound, searchQuery, position } = props;

    return (
        <Scrollbar sx={{ overflowY: 'auto', maxHeight: 600 }}>
            <Table>
              <SupplierListHead
                order={order}
                orderBy={orderBy}
                headLabel={headLabel}
                rowCount={rowCount}
                numSelected={numSelected}
                onRequestSort={onRequestSort}
                onSelectAllClick={onSelectAllClick}
              />
              <SupplierBody suppliers={suppliers} position={position} />
              {userNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={searchQuery} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Scrollbar>
    )
}

export default SupplierScrollbar
