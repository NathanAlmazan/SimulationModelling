import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

function stringAvatar(name) {
  return {
      sx: {
      bgcolor: "#bcdbbc",
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
  } 

export default function SupplierList(props) {
  const { suppliers, selected, setSelected, setOpen } = props;

  const handleListItemClick = (event, supplier) => {
    setSelected(supplier);
    setOpen(false);
  };
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <List component="nav" aria-label="main mailbox folders">
        {suppliers.map((customer, index) => {
            const { id, full_name, company_name } = customer;
            const selectedIndex = selected !== null ? selected.id : 0;

            return (
            <ListItemButton
                key={index}
                selected={selectedIndex === id}
                onClick={(event) => handleListItemClick(event, customer)}
            >
                <ListItemAvatar>
                <Avatar {...stringAvatar(full_name)} />
            </ListItemAvatar>
                <ListItemText primary={full_name} secondary={company_name !== null ? company_name : "Unspecified"} />
            </ListItemButton>
            )
        })}
        </List>
    </List>
  );
}
