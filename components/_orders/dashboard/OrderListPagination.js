import React from 'react';
import TablePagination from '@mui/material/TablePagination';

function OrderListPagination(props) {
    const { count, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage } = props;

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => handleChangePage(event, newPage)}
            onRowsPerPageChange={event => handleChangeRowsPerPage(event)}
          />
    )
}

export default OrderListPagination
