import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useRouter } from 'next/router';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

// ----------------------------------------------------------------------
async function updateEmployee(employeeId, first_name, last_name, email, contact, city, province, position, zip_code, address, token) {
  const baseURL = API_CLIENT_SIDE();
  try {
      const response = await axios({
          url: `${baseURL}/users/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
          },
          data: {
            query: `
              mutation UpdateEmployee ($ID: Int!, $Position: PositionTypes, $firstName: String, $lastName: String, $Contact: String, $Email: EmailAddress, $zipCode: Int, $Address: String, $City: String, $Province: String) {
                updateEmployee (id: $ID, position: $Position, first_name: $firstName, last_name: $lastName, contact_number: $Contact, email: $Email, zip_code: $zipCode, address: $Address, city: $City, province: $Province) {
                      id
                      first_name
                      last_name
                  }
              }
            `,
            variables: {
              ID: employeeId,
              firstName: first_name,
              lastName: last_name,
              Email: email,
              Contact: contact,
              City: city,
              Province: province,
              Position: position, 
              zipCode: isNaN(parseInt(zip_code)) ? null : parseInt(zip_code),
              Address: address
            }
          }
        });

      const newCustomer = response.data.data;

      return { status: true, data: newCustomer };

  } catch (err) {
      const errorMessage = err.response.data.errors[0].message;
      return { status: false, message: errorMessage };
  }
}

const filter = createFilterOptions();

function sortProvinces (array) {
    let newProvinceArray = [];
    array.forEach(object => {
        if (newProvinceArray.length === 0) newProvinceArray.push(object.province);
        if (!newProvinceArray.includes(object.province)) newProvinceArray.push(object.province);
    });
    return newProvinceArray;
}

const employeePosition = [
    { value: "MANAGER", label: "Manager" },
    { value: "ACCOUNTANT", label: "Accountant" },
    { value: "CASHIER", label: "Cashier" },
    { value: "WSTAFF", label: "Warehouse Staff" },
    { value: "DELIVERY", label: "Delivery Personnel" },
    { value: "AGENT", label: "Sales Agent" }
]

export default function UpdateEmployee(props) { 
  const { employee, accessToken, disablePosition } = props;
  const history = useRouter(); 
  const [resultCity, setCity] = useState({ city: employee.city, province: "Please type a province..." });
  const [inputCity, setInputCity] = useState('');
  const [resultProvince, setProvince] = useState(employee.province);
  const [inputProvince, setInputProvince] = useState('');
  const [cityOptions, setCityOptions] = useState([{ city: "Please type a city...", province: "Please type a province..." }]);
  const [provinceOptions, setProvinceOptions] = useState(["Please type a province..."]);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    contactNumber: Yup.string().min(11, 'Invalid Cellphone Number').max(12, 'Invalid Cellphone Number').required('Contact number required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    position: Yup.string().min(2, 'Too Short!').required("Employee position is required."),
    zipCode: Yup.string().min(1, 'Too Short!'),
    address: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required("Address is required.")
  });

  const formik = useFormik({
    initialValues: {
      firstName: employee.first_name,
      lastName: employee.last_name,
      contactNumber: employee.contact_number,
      position: employee.position,
      zipCode: employee.zip_code !== null ? employee.zip_code : '',
      email: employee.email,
      password: '',
      address: employee.address !== null ? employee.address : ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      const newCustomer = await updateEmployee(employee.id, values.firstName, values.lastName, values.email, values.contactNumber, resultCity.city, resultProvince, values.position, values.zipCode, values.address, accessToken);
      if (newCustomer.status !== false) {
          console.log(newCustomer.data);
          history.back();
      } 
      else if (newCustomer.status === false) {
        console.log(newCustomer.message);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  useEffect(() => {
    async function getPlaceSuggestions() {
        if (inputCity.length > 2 || inputProvince.length > 2) {
            const config = {
                headers: {
                    'Content-Type': 'application/json', 
                }
            };
            const baseURL = API_CLIENT_SIDE();
            const city = inputCity;
            const province = inputProvince;
            const body = JSON.stringify({ city, province });
            
            try {
                const response = await axios.post(`${baseURL}/users/suggestLocation`, body, config);
                const suggestions = response.data;
        
                setCityOptions(state => suggestions.data);
                const newProvinceArray = sortProvinces(suggestions.data);
                setProvinceOptions(newProvinceArray);
        
            } catch(err) {
                console.log(err.response);
            }
        }
    }


    getPlaceSuggestions();
  }, [inputCity, inputProvince]);

  const defaultCityProps = {
    options: cityOptions,
    getOptionLabel: (option) => option.city,
    isOptionEqualToValue: (option, value) => option.id === value.id
  };

  const defaultProvinceProps = {
    options: provinceOptions,
    getOptionLabel: (option) => option,
    isOptionEqualToValue: (option, value) => option.id === value.id
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              required
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              required
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Cellphone Number"
              {...getFieldProps('contactNumber')}
              error={Boolean(touched.contactNumber && errors.contactNumber)}
              helperText={touched.contactNumber && errors.contactNumber}
            />

            <TextField
              fullWidth
              required
              label="Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              required
              select
              disabled={disablePosition}
              label="Position"
              {...getFieldProps('position')}
              error={Boolean(touched.position && errors.position)}
              helperText={touched.position && errors.position}
            >
                {employeePosition.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              label="Zip Code"
              {...getFieldProps('zipCode')}
              error={Boolean(touched.zipCode && errors.zipCode)}
              helperText={touched.zipCode && errors.zipCode}
            />
          </Stack>

          <TextField
            fullWidth
            required
            label="Address"
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Autocomplete
                {...defaultCityProps}
                value={resultCity}
                onChange={(event, newValue) => {
                    setCity(newValue);
                }}
                inputValue={inputCity}
                onInputChange={(event, newInputValue) => {
                    setInputCity(newInputValue);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
          
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.city);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({ city: inputValue, province: " "});
                  }
          
                  return filtered;
                }}
                fullWidth
                autoComplete
                renderInput={(params) => (
                <TextField {...params} label="City" />
                )}
            />

            <Autocomplete
                {...defaultProvinceProps}
                value={resultProvince}
                onChange={(event, newValue) => {
                    setProvince(newValue);
                }}
                inputValue={inputProvince}
                onInputChange={(event, newInputValue) => {
                    setInputProvince(newInputValue);
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
          
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push(inputValue);
                  }
          
                  return filtered;
                }}
                fullWidth
                autoComplete
                renderInput={(params) => (
                <TextField {...params} label="Province" />
                )}
            />
        </Stack>

        <br />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update Employee
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
