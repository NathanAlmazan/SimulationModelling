import React from 'react';
import { useRouter } from 'next/router';
import Link from '@mui/material/Link';
// material
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout({ children }) {
  const history = useRouter();
  const onRouterClick = (e, path) => {
    history.push(path)
  }
  return (
    <>
      <HeaderStyle>
        <Link underline="none" onClick={e => onRouterClick(e, "/")}>
          <Logo />
        </Link>
      </HeaderStyle>
      {children}
    </>
  );
}
