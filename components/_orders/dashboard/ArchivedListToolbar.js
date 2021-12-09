import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import FilterMenu from './FilterMenu';
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
    const { numSelected, filterName, onFilterName, selected, setSelected, purpose, allFunction } = props; 

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
            placeholder={`Search ${selected === "Order ID" ? "Invoice" : selected}...`}
            startAdornment={
              <InputAdornment position="start">
                <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
        </Stack>
        
      )}

      {numSelected > 0 && (
        purpose === "delivery" ? (
            <IconButton onClick={e=> allFunction()}>
                <AllInboxIcon  />
            </IconButton>
        ) : purpose === "restore" ? (
            <IconButton onClick={e=> allFunction()}>
                <RestorePageIcon  />
            </IconButton>
        ) : (
            <IconButton>
                <DeleteIcon  />
            </IconButton>
        )
          
      )}
    </RootStyle>
  );
}
