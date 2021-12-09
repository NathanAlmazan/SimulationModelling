import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
// components
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("../components/Logo"));
const MHidden = dynamic(() => import("../components/MHidden"));
const Scrollbar = dynamic(() => import("../components/Scrollbar"));
const NavSection = dynamic(() => import("../components/NavSection"));
//
import { AgentConfig, AccountantConfig, CashierConfig, WarehouseConfig, ExecutiveConfig } from './SidebarConfig';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;



const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

  const AccountStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadiusSm,
    backgroundColor: theme.palette.grey[200]
  }));
  
  // ----------------------------------------------------------------------
  
  DashboardSidebar.propTypes = {
    isOpenSidebar: PropTypes.bool,
    onCloseSidebar: PropTypes.func
  };
  
  export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, user }) {
    const { asPath } = useRouter();
    const history = useRouter();

    const ExecutivePosition = ["President", "Vice President", "Manager"];
  
    useEffect(() => {
      if (isOpenSidebar) {
        onCloseSidebar();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asPath]);

    const onRouterClick = (e, path) => {
      history.push(path)
    }
  
    return (
      <RootStyle>
        <MHidden width="lgUp">
          <Drawer
            open={isOpenSidebar}
            onClose={onCloseSidebar}
            PaperProps={{
              sx: { width: DRAWER_WIDTH }
            }}
          >
            <Scrollbar
              sx={{
                height: '100%',
                '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
              }}
            >
              <Box sx={{ px: 2.5, py: 3 }}>
                <Box onClick={e => onRouterClick(e, "/")} href="/" sx={{ display: 'inline-flex' }}>
                  <Logo />
                </Box>
              </Box>
        
              <Box sx={{ mb: 5, mx: 2.5 }}>
                <Link underline="none" onClick={e => onRouterClick(e, "/")}>
                  <AccountStyle>
                    <Avatar src={user.image} alt="photoURL" />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.position}
                      </Typography>
                    </Box>
                  </AccountStyle>
                </Link>
              </Box>
              {user.position === "Sales Agent" && (
                <NavSection navConfig={AgentConfig} />
              )}

              {user.position === "Accountant" && (
                <NavSection navConfig={AccountantConfig} />
              )}

              {user.position === "Cashier" && (
                <NavSection navConfig={CashierConfig} />
              )}
              
              {user.position === "Warehouse Staff" && (
                <NavSection navConfig={WarehouseConfig} />
              )}

              {user.position === "Delivery Personnel" && (
                <NavSection navConfig={WarehouseConfig} />
              )}

              {ExecutivePosition.includes(user.position) && (
                <NavSection navConfig={ExecutiveConfig} />
              )}

              <Box sx={{ flexGrow: 1, minHeight: 10 }} />
        
            </Scrollbar>
          </Drawer>
        </MHidden>
  
        <MHidden width="lgDown">
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: 'background.default'
              }
            }}
          >
            <Scrollbar
              sx={{
                height: '100%',
                '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
              }}
            >
              <Box sx={{ px: 2.5, py: 3 }}>
                <Box onClick={e => onRouterClick(e, "/")} href="/" sx={{ display: 'inline-flex' }}>
                  <Logo />
                </Box>
              </Box>
        
              <Box sx={{ mb: 5, mx: 2.5 }}>
                <Link underline="none" onClick={e => onRouterClick(e, "/")}>
                  <AccountStyle>
                      <Avatar src={user.image} alt="photoURL" />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {user.position}
                        </Typography>
                      </Box>
                    </AccountStyle>
                </Link>
              </Box>
              {user.position === "Sales Agent" && (
                <NavSection navConfig={AgentConfig} />
              )}

              {user.position === "Accountant" && (
                <NavSection navConfig={AccountantConfig} />
              )}

              {user.position === "Cashier" && (
                <NavSection navConfig={CashierConfig} />
              )}
              
              {user.position === "Warehouse Staff" && (
                <NavSection navConfig={WarehouseConfig} />
              )}

              {user.position === "Delivery Personnel" && (
                <NavSection navConfig={WarehouseConfig} />
              )}

              {ExecutivePosition.includes(user.position) && (
                <NavSection navConfig={ExecutiveConfig} />
              )}

              <Box sx={{ flexGrow: 1, minHeight: 10 }} />
        
            </Scrollbar>
          </Drawer>
        </MHidden>
      </RootStyle>
    );
  }
  