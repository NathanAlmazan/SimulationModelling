import SearchIcon from '@mui/icons-material/Search';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  IconButton,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import dynamic from "next/dynamic";

const SupplierMoreMenu = dynamic(() => import('./SupplierMoreMenu'));

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

export default function UserListToolbar({ filterName, onFilterName, handleFilterMenu }) {
  return (
    <RootStyle >
      <SearchStyle
        value={filterName}
        onChange={onFilterName}
        placeholder="Search supplier..."
        startAdornment={
          <InputAdornment position="start">
            <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
 

      <IconButton>
        <SupplierMoreMenu
          onHead={true} 
          handleFilterMenu={(order, orderBy) => handleFilterMenu(order, orderBy)}
        />
      </IconButton>


    </RootStyle>
  );
}
