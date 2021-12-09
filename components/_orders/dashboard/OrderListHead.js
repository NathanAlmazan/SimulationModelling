// material
import { visuallyHidden } from '@mui/utils';
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------

const headLabel = [
    { id: 'id', label: 'Invoice ID', alignRight: false },
    { id: 'customer', label: 'Cutomer', alignRight: true },
    { id: 'employee', label: 'Sales Agent', alignRight: true },
    { id: 'delivered', label: 'Date Delivered', alignRight: true },
    { id: 'order_date', label: 'Order Date', alignRight: true },
    { id: 'due_date', label: 'Due Date', alignRight: true },
    { id: 'order_balance', label: 'Balance', alignRight: true },
    { id: 'days_left', label: 'Status', alignRight: true },
    { id: '' }
]

export default function OrderListHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  hideCheckbox
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
<TableHead>
      <TableRow>
        <TableCell padding="checkbox">
         {!hideCheckbox &&  
         (
            <Checkbox
              disabled={Boolean(numSelected <= 0)}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
         )}
        </TableCell>
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
