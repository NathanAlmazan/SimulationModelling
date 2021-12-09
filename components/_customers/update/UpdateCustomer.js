import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useRouter } from 'next/router';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

// ----------------------------------------------------------------------
async function updateCustomer(customerId, first_name, last_name, email, contact, city, province, company, website, address, token) {
  const baseURL = API_CLIENT_SIDE();
  try {
      const response = await axios({
          url: `${baseURL}/sales/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
          },
          data: {
            query: `
              mutation UpdateCustomer ($ID: Int!, $Company: String, $firstName: String, $lastName: String, $Contact: String, $Email: EmailAddress, $Website: String, $Address: String, $City: String, $Province: String) {
                updateCustomer (id: $ID, company_name: $Company, first_name: $firstName, last_name: $lastName, contact_number: $Contact, email: $Email, website: $Website, address: $Address, city: $City, province: $Province) {
                      id
                      first_name
                      last_name
                      company_name
                  }
              }
            `,
            variables: {
              ID: customerId,
              firstName: first_name,
              lastName: last_name,
              Email: email,
              Contact: contact,
              City: city,
              Province: province,
              Company: company, 
              Website: website,
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

export default function UpdateCustomer(props) {
  const { customer, user } = props;
  const history = useRouter(); 
  const [resultCity, setCity] = useState(null);
  const [inputCity, setInputCity] = useState('');
  const [resultProvince, setProvince] = useState(null);
  const [inputProvince, setInputProvince] = useState('');
  const [cityOptions, setCityOptions] = useState([{ city: "Please type a city...", province: "Please type a province..." }]);
  const [provinceOptions, setProvinceOptions] = useState(["Please type a province..."]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(state => user);
    setCity(state => ({ city: customer.city, province: customer.province }));
    setProvince(state => customer.province);
  }, [customer, user]);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    contactNumber: Yup.string().min(11, 'Invalid Cellphone Number').max(12, 'Invalid Cellphone Number').required('Contact number required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    companyName: Yup.string().min(2, 'Too Short!'),
    website: Yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    ),
    address: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!')
  });

  const formik = useFormik({
    initialValues: {
      firstName: customer.first_name,
      lastName: customer.last_name,
      contactNumber: customer.contact_number !== null ? customer.contact_number : '',
      companyName: customer.company_name !== null ? customer.company_name : '',
      website: customer.website !== null ? customer.website : '',
      email: customer.email !== null ? customer.email : '',
      address: customer.address !== null ? customer.address : ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      const newCustomer = await updateCustomer(customer.id, values.firstName, values.lastName, values.email, values.contactNumber, resultCity.city, resultProvince, values.companyName, values.website, values.address, session.access_token);
      if (newCustomer.status !== false) {
          console.log(newCustomer.data);
          history.push("/customers/profile/" + customer.id);
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
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
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
              label="Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Company Name"
              {...getFieldProps('companyName')}
              error={Boolean(touched.companyName && errors.companyName)}
              helperText={touched.companyName && errors.companyName}
            />

            <TextField
              fullWidth
              label="Website"
              {...getFieldProps('website')}
              error={Boolean(touched.website && errors.website)}
              helperText={touched.website && errors.website}
            />
          </Stack>

          <TextField
            fullWidth
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
            startIcon={<EditIcon />}
          >
            Update Customer
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
