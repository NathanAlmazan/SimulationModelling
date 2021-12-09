import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import FolderIcon from '@mui/icons-material/Folder';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Scrollbar from '../../Scrollbar';

const LIST_OPTIONS = [
    { name: "Order", description: "Data of all orders" }, 
    { name: "Transaction", description: "Data of all receivables transactions" }, 
    { name: "Purchase", description: "Data of all purchase" }, 
    { name: "Payables", description: "Data of all payables transactions" }, 
    { name: "Customer", description: "Data of all customers" }, 
    { name: "Product", description: "Data of all products" }, 
    { name: "Category", description: "Data of all product categories" }, 
    { name: "Supplier", description: "Data of all suppliers" },
    { name: "Employee", description: "Data of all employee" },
    { name: "Account", description: "Data of all user accounts" }
]
function BackupManager({ downloadFile }) {
    return (
       <Card>
           <CardHeader 
                title="Backup Manager"
           />
           <Scrollbar sx={{ overflowY: 'auto', maxHeight: 365 }}>
           <List>
               {LIST_OPTIONS.map((option, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="download" onClick={() => downloadFile(option.name)}>
                      <FileDownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={option.name}
                    secondary={option.description}
                  />
                </ListItem>
               ))}
            </List>
            </Scrollbar>
       </Card>
    )
}

export default BackupManager
