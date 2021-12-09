import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import EmployeeMenu from './EmployeeMenu';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Stack,
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
    const { filterName, onFilterName, selected, setSelected, changeYear, year } = props; 

  return (
    <RootStyle>
        <Grid container direction="row" justifyContent="space-between">
            <Grid item>
                <EmployeeMenu selected={selected} setSelected={value => setSelected(value)} />
                <SearchStyle
                    value={filterName}
                    onChange={event => onFilterName(event.target.value)}
                    placeholder={`Search ${selected === "Order ID" ? "Invoice ID" : selected}...`}
                    startAdornment={
                    <InputAdornment position="start">
                        <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                    }
                />
            </Grid>

            <Grid item>
                <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center">
                    <IconButton onClick={event => changeYear(event, "back")}>
                        <KeyboardArrowLeftIcon  />
                    </IconButton>
                    <Typography variant="subtitle2">
                        {year !== null ? year : new Date().getFullYear()}
                    </Typography>
                    <IconButton onClick={event => changeYear(event, "next")}>
                        <KeyboardArrowRightIcon  />
                    </IconButton>
                </Stack>
            </Grid>
        </Grid>

    </RootStyle>
  );
}
