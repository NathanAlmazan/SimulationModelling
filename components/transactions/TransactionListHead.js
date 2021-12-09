// material
import { visuallyHidden } from '@mui/utils';
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------

const headLabel = [
    { id: 'id', label: 'ID', alignRight: false },
    { id: 'invoice_id', label: 'Invoice ID', alignRight: true },
    { id: 'name', label: 'Encoder', alignRight: true },
    { id: 'payment_date', label: 'Payment Date', alignRight: true },
    { id: 'amount_paid', label: 'Amount', alignRight: true },
    { id: 'days_left', label: 'Status', alignRight: true },
    { id: '' }
]

export default function ArchivedListHead({
  order,
  orderBy,
  onRequestSort,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
<TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
