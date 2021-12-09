import React, { useRef, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { signOut } from "next-auth/client";
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import dynamic from "next/dynamic";

const MenuPopover = dynamic(() => import("../components/MenuPopover"));

// ----------------------------------------------------------------------

export default function AccountPopover({ user }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const history = useRouter();

  const MENU_OPTIONS = [
    {
      label: 'Home',
      icon: HomeIcon,
      linkTo: '/'
    },
    {
      label: 'Profile',
      icon: PersonIcon,
      linkTo: `/employees/profile/${user.employeeId}`
    }
  ];

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = (e, path) => {
    if (path !== null) {
      history.push(path);
    }
    setOpen(false);
  };

  const handleLogout = async (e) => {
    const data = await signOut({redirect: false, callbackUrl: "/signin"});
    history.push(data.url);
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={user.image} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={event => handleClose(event, null)}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            { user.name }
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            { user.position }
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={e => handleClose(e, option.linkTo)}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
