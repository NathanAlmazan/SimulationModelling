import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import dynamic from "next/dynamic";
import { filter } from 'lodash';
import axios from 'axios';

const EmployeeList = dynamic(() => import("../../components/_employees/dashboard/EmployeeList"));
const EmployeeSort = dynamic(() => import("../../components/_employees/dashboard/EmployeeSort"));


const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  }));

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
        const filterByName = filter(array, (_employee) => _employee.full_name.toLowerCase().includes(query.toLowerCase()));
        const filterByContact = filter(array, (_employee) => _employee.contact_number.includes(query));
        const finalFiltered = filterByName.filter(value => filterByContact.map(function(p) { return p.id; }).indexOf(value.id) === -1);
        return finalFiltered.concat(filterByContact);
    }
    return stabilizedThis.map((el) => el[0]);
  }
  

export default function EmployeeDashboard({ allEmployees }) {
    const [employeeList, setEmployeeList] = useState([]);
    const [orderBy, setOrderBy] = useState("total_sold");
    const [order, setOrder] = useState("desc");
    const [filterString, setFilterString] = useState("");
    const [option, setOption] = useState({ value: 'total_sold:desc', label: 'Sales: High-Low' });
    const history = useRouter();

    useEffect(() => {
      async function authenticate () {
          const session = await getSession();
          const ExecutivePosition = ["President", "Vice President", "Manager"];
          if (!session) {
              history.push("/signin");
          }
          if (!ExecutivePosition.includes(session.position)) {
              history.push("/401");
          }
      }
     
      authenticate();
    }, [history]);

    useEffect(() => {
        const filteredEmployees = applySortFilter(allEmployees, getComparator(order, orderBy), filterString);
        setEmployeeList(state => filteredEmployees);
    
      }, [allEmployees, order, orderBy, filterString]);

    const handleOptionChange = (option) => {
        setOption(option);
        const sortObject = option.value;
        setOrderBy(sortObject.split(':')[0]);
        setOrder(sortObject.split(':')[1]);
    }


    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Employees
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => history.push("/employees/create")}
                    startIcon={<AddIcon />}
                    >
                    Add Employee
                </Button>
            </Stack>

            <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 5 }}
            >
                <SearchStyle
                    value={filterString}
                    onChange={event => setFilterString(event.target.value)}
                    placeholder="Search employee..."
                    startAdornment={
                    <InputAdornment position="start">
                        <Box component={SearchIcon} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                    }
                />
            
                <EmployeeSort currOption={option} setOption={value => handleOptionChange(value)} />
          
             </Stack>

            <EmployeeList 
                employees={employeeList}
            />
        </Container>
    )
}

export async function getServerSideProps(ctx) {

    try {
      const response = await axios({
          url: `${process.env.API_BASE_URL}/users/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + process.env.BACKEND_KEY
          },
          data: {
            query: `
              query GetAllEmployees {
                allEmployees {
                    id
                    full_name
                    contact_number
                    position
                    profile_image
                    total_sold
                }
              }
            `,
          }
        });
      
      const allEmployee = response.data.data;
    
      if (!allEmployee.allEmployees) {
        return {
          notFound: true,
        }
      }
    
      return {
        props: { allEmployees: allEmployee.allEmployees }
      }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}


