
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
// material
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

const DateRanges = [
  { value: "DAY", label: "Day" },
  { value: "WEEK", label: "Week" },
  { value: "MONTH", label: "Month" },
]


export default function TransactionToolbar(props) {
    const { selectedDate, selectedRange, onDateChange, onRangeChange } = props; 

  return (
    <RootStyle>
        <Stack direction="row" spacing={2}>
            <TextField
                sx={{ width: 200 }}
                type="Date"
                name="selectedDate"
                value={new Date(selectedDate).toJSON().slice(0,10)}
                onChange={event => onDateChange(event)}
                label="Selected Date"
              />

            <TextField
                select
                sx={{ width: 150 }}
                label="Date Range"
                value={selectedRange}
                onChange={event => onRangeChange(event)}
                name="date_range"
                >
                {DateRanges.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Stack>
    </RootStyle>
  );
}
