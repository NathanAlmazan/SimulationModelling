import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import dynamic from "next/dynamic";
import { filter } from 'lodash';

const CustomerList = dynamic(() => import("./CustomerList"));

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

export default function ProductDialog(props) {
  const { open, setOpen, selected, setSelected, customers, agent } = props;
  const [filterName, setFilterName] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers)
  const fullScreen = useMediaQuery("(max-width: 600px)");

  const handleClose = () => {
    setOpen(false);
  };

  const filterCustomers = (name) => {
    if (!agent) {
      const filterByName = filter(customers, (_customer) => _customer.full_name.toLowerCase().includes(name.toLowerCase()));
      const filterByCompany = filter(customers, (_customer) => _customer.company_name.toLowerCase().includes(name.toLowerCase()));
      const finalFiltered = filterByName.filter(value => filterByCompany.map(function(p) { return p.id; }).indexOf(value.id) === -1);
      setFilteredCustomers(finalFiltered.concat(filterByCompany));
    } else {
      const filterByName = filter(customers, (_customer) => _customer.full_name.toLowerCase().includes(name.toLowerCase()));
      const filterByCompany = filter(customers, (_customer) => _customer.email.toLowerCase().includes(name.toLowerCase()));
      const finalFiltered = filterByName.filter(value => filterByCompany.map(function(p) { return p.id; }).indexOf(value.id) === -1);
      setFilteredCustomers(finalFiltered.concat(filterByCompany));
    }
    
  }

  const onFilterName = (event) => {
    setFilterName(event.target.value);
    filterCustomers(event.target.value);
  }

  return (
      <Dialog
        fullWidth={true}
        fullScreen={fullScreen}
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={!fullScreen ? { maxHeight: "80vh" } : {}}
      >
        <DialogTitle>{!agent ? "Select Customer" : "Select Sales Agent" }</DialogTitle>
        <DialogContent>
            <SearchStyle
              value={filterName}
              onChange={onFilterName}
              placeholder={!agent ? "Search Customer..." : "Search Agent..." }
              startAdornment={
                <InputAdornment position="start">
                  <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
            />
          
            <CustomerList customers={filteredCustomers} selected={selected} setSelected={value => setSelected(value)} setOpen={value => setOpen(value)} agent={agent} />

        </DialogContent>
      </Dialog>
  );
}
