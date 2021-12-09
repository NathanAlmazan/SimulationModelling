import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FilterMenu from './PurchasedFilterMenu';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

const DateRanges = [
  { value: "DAY", label: "Day" },
  { value: "WEEK", label: "Week" },
  { value: "MONTH", label: "Month" },
]


export default function OrderListToolbar(props) {
    const { numSelected, filterName, onFilterName, selectedDate, dateRange, setSelectedDate, setDateRange, orderDue, setOrderDue, selected, setSelected } = props; 

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" spacing={2}>
          <FilterMenu selected={selected} setSelected={value => setSelected(value)} />

          <SearchStyle
            value={filterName}
            onChange={event => onFilterName(event.target.value)}
            placeholder={`Search ${selected}...`}
            startAdornment={
              <InputAdornment position="start">
                <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
        </Stack>
        
      )}

      {numSelected > 0 ? (
          <IconButton>
            <DeleteIcon  />
          </IconButton>
      ) : (
        <Stack direction="row" spacing={2}>

            <Switch
              checked={orderDue}
              onChange={event => setOrderDue(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
         
            {orderDue ? (
              <TextField
                sx={{ width: 150 }}
                variant="standard"
                type="Date"
                name="selectedDate"
                value={selectedDate}
                onChange={event => setSelectedDate(event.target.value)}
                label="Due Date"
                //value={new Date().toJSON().slice(0,10)}
              />
            ): (
              <TextField
                sx={{ width: 150 }}
                variant="standard"
                type="Date"
                name="selectedDate"
                value={selectedDate}
                onChange={event => setSelectedDate(event.target.value)}
                label="Purchase Date"
                //value={new Date().toJSON().slice(0,10)}
              />
            )}
        
            <TextField
                select
                sx={{ width: 150 }}
                variant="standard"
                label="Date Range"
                value={dateRange}
                onChange={event => setDateRange(event.target.value)}
                name="date_range"
                >
                {DateRanges.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
              </TextField>
          
        </Stack>
      )}
    </RootStyle>
  );
}
