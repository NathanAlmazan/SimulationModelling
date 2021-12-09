import React, { useEffect } from 'react';
import { filter } from 'lodash';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
// material
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArchiveIcon from '@mui/icons-material/Archive';
// components
import dynamic from "next/dynamic";
//data fetching
import axios from 'axios';

const CustomerListToolbar = dynamic(() => import('../../components/_customers/CustomerListToolbar'));
const CustomerScrollbar = dynamic(() => import('../../components/_customers/CustomerScrollbar'), { ssr: false });



// ----------------------------------------------------------------------
  

const TABLE_HEAD = [
  { id: 'full_name', label: 'Name', alignRight: false },
  { id: 'company_name', label: 'Company', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'contact_number', label: 'Contact', alignRight: false },
  { id: 'total_credits', label: 'Credits', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
      const filterByName = filter(array, (_customer) => _customer.full_name.toLowerCase().includes(query.toLowerCase()));
      const filterByCompany = filter(array, (_customer) => _customer.company_name.toLowerCase().includes(query.toLowerCase()));
      const finalFiltered = filterByName.filter(value => filterByCompany.map(function(p) { return p.id; }).indexOf(value.id) === -1);
      return finalFiltered.concat(filterByCompany);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function Customers({ allCustomers, currUser }) {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('total_credits');
  const [filterName, setFilterName] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isUserNotFound, setIssUserNotFound] = useState(false);
  const history = useRouter();

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  useEffect(() => {
    const filteredCustomers = applySortFilter(allCustomers, getComparator(order, orderBy), filterName);
    setFilteredUsers(state => filteredCustomers);
    setIssUserNotFound(state => filteredCustomers.length === 0);

  }, [filterName, allCustomers, order, orderBy]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterMenu = (order, orderBy) => {
    setOrder(order);
    setOrderBy(orderBy);
  }

  return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Customers
          </Typography>
            <Button
              variant="contained"
              onClick={e => onRouterClick(e, "/customers/create")}
              startIcon={<AddIcon />}
            >
              Add Customer
            </Button>
        </Stack>

        <Card>
          <CustomerListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            handleFilterMenu={(order, orderBy) => handleFilterMenu(order, orderBy)}
          />

          <CustomerScrollbar
              order={order} 
              orderBy={orderBy} 
              headLabel={TABLE_HEAD} 
              rowCount={filteredUsers.length} 
              onRequestSort={handleRequestSort} 
              onSelectAllClick={handleSelectAllClick} 
              customers={filteredUsers} 
              userNotFound={isUserNotFound} 
              searchQuery={filterName}
              position={currUser.position}
          />

        </Card>
      </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/signin'
      }
    }
  }

  if (!ExecutivePosition.includes(session.position)) {
    return {
        redirect: {
          permanent: false,
          destination: '/401'
        }
      }
  }

    const response = await axios({
        url: `${process.env.API_BASE_URL}/sales/graphql`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'KEY ' + process.env.BACKEND_KEY
        },
        data: {
          query: `
            query ShowCustomers {
                showAllCustomers {
                    id
                    first_name
                    last_name
                    full_name
                    company_name
                    contact_number
                    email
                    total_credits
                    total_bought
                    is_active
                }
            }
          `,
        }
      });

    const allCustomers = response.data.data;
  
    if (!allCustomers.showAllCustomers) {
      return {
        notFound: true,
      }
    }
  
    return {
      props: { allCustomers: allCustomers.showAllCustomers, currUser: session }
    }
  }