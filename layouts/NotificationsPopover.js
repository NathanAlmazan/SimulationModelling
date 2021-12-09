import faker from 'faker';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import React, { useRef, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRouter } from 'next/router';
// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  List,
  Badge,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemButton
} from '@mui/material';
// components
import dynamic from "next/dynamic";
const Scrollbar = dynamic(() => import("../components/Scrollbar"));
const MenuPopover = dynamic(() => import("../components/MenuPopover"));

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.title === "Total receivables" ? notification.description : noCase(notification.description)}
      </Typography>
    </Typography>
  );

  return {
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  const { title } = renderContent(notification);
  const history = useRouter();
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const onRouterClick = (e, path) => {
    history.push(path)
  }

  return (
    <ListItemButton
      disableGutters
      onClick={e => onRouterClick(e, notification.link)}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={WatchLaterIcon} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {new Date(notification.createdAt).toLocaleDateString(undefined, options)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover(props) {
  const { notifications, setNotifications } = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false
      }))
    );
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </List>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
