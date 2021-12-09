import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

function stringAvatar(name, credit) {
  return {
      sx: {
      bgcolor: credit ? "#FFA48D" : "#bcdbbc",
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
  } 

export default function CustomerList(props) {
  const { customers, selected, setSelected, setOpen, agent } = props;

  const handleListItemClick = (event, customer) => {
    setSelected(customer);
    setOpen(false);
  };
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {!agent ? (
          <List component="nav" aria-label="main mailbox folders">
            {customers.map((customer, index) => {
              const { id, full_name, company_name, total_credits } = customer;
              const onCredit = Boolean(total_credits > 0);
              const selectedIndex = selected !== null ? selected.id : 0;

              return (
                <ListItemButton
                  key={index}
                  selected={selectedIndex === id}
                  onClick={(event) => handleListItemClick(event, customer)}
                >
                  <ListItemAvatar>
                    <Avatar {...stringAvatar(full_name, onCredit)} />
                </ListItemAvatar>
                  <ListItemText primary={full_name} secondary={company_name !== null ? company_name : "Unspecified"} />
                </ListItemButton>
              )
            })}
            
          </List>
      ) : (
        <List component="nav" aria-label="main mailbox folders">
            {customers.map((agent, index) => {
              const { id, full_name, email } = agent;
              const selectedIndex = selected !== null ? selected.id : 0;

              return (
                <ListItemButton
                  key={index}
                  selected={selectedIndex === id}
                  onClick={(event) => handleListItemClick(event, agent)}
                >
                  <ListItemAvatar>
                    <Avatar {...stringAvatar(full_name, false)} />
                </ListItemAvatar>
                  <ListItemText primary={full_name} secondary={email} />
                </ListItemButton>
              )
            })}
            
        </List>
      )}
    
    </List>
  );
}
