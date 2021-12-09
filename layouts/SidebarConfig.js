import React from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// ----------------------------------------------------------------------

export const ExecutiveConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: <ExtensionIcon />
  },
  {
    title: 'employees',
    path: '/employees',
    icon: <AccountCircleIcon />
  },
  {
    title: 'customers',
    path: '/customers',
    icon: <PeopleAltIcon />
  },
  {
    title: 'suppliers',
    path: '/suppliers',
    icon: <PeopleAltIcon />
  },
  {
    title: 'products',
    path: '/products',
    icon: <LocalMallIcon />
  },
  {
    title: 'sales orders',
    path: '/orders',
    icon: <DescriptionIcon />,
    children: [
      { 
        title: 'active orders',
        path: '/orders'
      },
      {
        title: 'shipping orders',
        path: '/orders/delivery',
      },
      { 
        title: 'overdue orders',
        path: '/orders/overdue'
      },
      { 
        title: 'create order',
        path: '/orders/create'
      },
    ]
  },
  {
    title: 'purchased orders',
    path: '/purchase',
    icon: <StoreIcon />,
    children: [
      { 
        title: 'active purchase',
        path: '/purchase'
      },
      { 
        title: 'arriving stocks',
        path: '/purchase/shipment'
      },
      { 
        title: 'overdue purchase',
        path: '/purchase/overdue'
      },
      { 
        title: 'Record Purchase',
        path: '/purchase/create'
      },
    ]
  },
  {
    title: 'transactions',
    path: '/transactions',
    icon: <ReceiptLongIcon />
  },
  {
    title: 'Archived',
    path: '/customers/archived',
    icon: <ArchiveIcon />,
    children: [
      { 
        title: 'customers',
        path: '/customers/archived'
      },
      { 
        title: 'employees',
        path: '/employees/archived'
      },
      { 
        title: 'suppliers',
        path: '/suppliers/archived'
      },
      { 
        title: 'products',
        path: '/products/archived'
      },
      { 
        title: 'sales orders',
        path: '/orders/canceled'
      },
      { 
        title: 'purchased orders',
        path: '/purchase/canceled'
      },
    ]
  }
];

export const AgentConfig = [
  {
    title: 'products',
    path: '/products',
    icon: <LocalMallIcon />
  }
];

export const WarehouseConfig = [
  {
    title: 'products',
    path: '/products',
    icon: <LocalMallIcon />
  },
  { 
    title: 'arriving stocks',
    path: '/purchase/shipment',
    icon: <AllInboxIcon />
  },
  {
    title: 'shipping orders',
    path: '/orders/delivery',
    icon: <LocalShippingIcon />
  }
];

export const CashierConfig = [
  { 
    title: 'create order',
    path: '/orders/create',
    icon: <ShoppingCartIcon />
  },
  {
    title: 'products',
    path: '/products',
    icon: <LocalMallIcon />
  },
  {
    title: 'customers',
    path: '/customers',
    icon: <PeopleAltIcon />
  },
  {
    title: 'sales orders',
    path: '/orders',
    icon: <DescriptionIcon />,
    children: [
      { 
        title: 'active orders',
        path: '/orders'
      },
      {
        title: 'shipping orders',
        path: '/orders/delivery',
      },
      { 
        title: 'overdue orders',
        path: '/orders/overdue'
      }
    ]
  }
];

export const AccountantConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: <ExtensionIcon />
  },
  {
    title: 'customers',
    path: '/customers',
    icon: <PeopleAltIcon />
  },
  {
    title: 'suppliers',
    path: '/suppliers',
    icon: <PeopleAltIcon />
  },
  {
    title: 'products',
    path: '/products',
    icon: <LocalMallIcon />
  },
  {
    title: 'sales orders',
    path: '/orders',
    icon: <DescriptionIcon />,
    children: [
      { 
        title: 'active orders',
        path: '/orders'
      },
      {
        title: 'shipping orders',
        path: '/orders/delivery',
      },
      { 
        title: 'overdue orders',
        path: '/orders/overdue'
      },
      { 
        title: 'create order',
        path: '/orders/create'
      },
    ]
  },
  {
    title: 'purchased orders',
    path: '/purchase',
    icon: <StoreIcon />,
    children: [
      { 
        title: 'active purchase',
        path: '/purchase'
      },
      { 
        title: 'arriving stocks',
        path: '/purchase/shipment'
      },
      { 
        title: 'overdue purchase',
        path: '/purchase/overdue'
      },
      { 
        title: 'Record Purchase',
        path: '/purchase/create'
      },
    ]
  },
  {
    title: 'transactions',
    path: '/transactions',
    icon: <ReceiptLongIcon />
  }
]