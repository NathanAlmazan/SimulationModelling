import React, { useState, useEffect } from 'react';
// material
import { styled } from '@mui/material/styles';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router';
import axios from 'axios';
//
import dynamic from "next/dynamic";
import API_CLIENT_SIDE from '../layouts/APIConfig';

const DashboardNavbar = dynamic(() => import("./DashboardNavbar"));
const DashboardSidebar = dynamic(() => import("./DashboardSidebar"));

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currUser, setUser] = useState({
    id: null,
    name: 'Loading...',
    position: 'Loading...',
    image: ''
  });
  const history = useRouter();

  useEffect(() => {
    async function getCurrentUser() {
      const baseURL = API_CLIENT_SIDE();
      const currUser = await getSession();

      if (!currUser) {
        history.push("/signin");
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + currUser.access_token,
          }
        }
        const result = await axios.get(`${baseURL}/users/user`, config);
        const profile = result.data.account;

        const response = await axios({
          url: `${baseURL}/statistics/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + currUser.access_token
          },
          data: {
            query: `
                query GetNotifications {
                  notifications {
                      title
                      description
                      createdAt
                      isUnRead
                      link
                    }
                }
            `,
          }
        });

        const dataResponse = response.data.data;

        setNotifications(state => dataResponse.notifications);
        setUser(state => ({ ...state, id: currUser.userId, name: currUser.user.name, position: currUser.position, image: profile.image !== null ? profile.image : "https://drive.google.com/uc?id=13cTZcKxY3MmZLO1ZxU0RLyZeDt9Qfzmf&export=download", employeeId: profile.employeeId }))
      } catch (err) {
        history.push("/signin");
      }
    }
    
    getCurrentUser();
    
  }, [history]);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} user={currUser} notifications={notifications} setNotifications={value => setNotifications(value)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} user={currUser} />
      <MainStyle>
        {children}
      </MainStyle>
    </RootStyle>
  );
}
