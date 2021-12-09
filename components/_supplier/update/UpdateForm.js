import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useRouter } from 'next/router';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

// ----------------------------------------------------------------------
async function addNewSupplier(id, first_name, last_name, email, contact, city, province, company, website, address, token) {
  const baseURL = API_CLIENT_SIDE();
  try {
      const response = await axios({
          url: `${baseURL}/payables/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
          },
          data: {
            query: `
              mutation UpdateSupplier ($ID: Int!, $Company: String, $firstName: String, $lastName: String, $Contact: String, $Email: EmailAddress, $Website: String, $Address: String, $City: String, $Province: String) {
                updateSupplier (id: $ID, company_name: $Company, first_name: $firstName, last_name: $lastName, contact_number: $Contact, email: $Email, website: $Website, address: $Address, city: $City, province: $Province) {
                      id
                      first_name
                      last_name
                  }
              }
            `,
            variables: {
              ID: id,
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

      const newSupplier = response.data.data;

      return { status: true, data: newSupplier };

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

export default function UpdateSupplier(props) {
  const { supplier, account } = props;
  const history = useRouter(); 
  const [resultCity, setCity] = useState({ city: supplier.city, province: "Please type a province..." });
  const [inputCity, setInputCity] = useState('');
  const [resultProvince, setProvince] = useState(supplier.province);
  const [inputProvince, setInputProvince] = useState('');
  const [cityOptions, setCityOptions] = useState([{ city: "Please type a city...", province: "Please type a province..." }]);
  const [provinceOptions, setProvinceOptions] = useState(["Please type a province..."]);
  const [session, setSession] = useState(account);

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
      firstName: supplier.first_name,
      lastName: supplier.last_name,
      contactNumber: supplier.contact_number,
      companyName: supplier.company_name,
      website: supplier.website,
      email: supplier.email,
      password: '',
      address: supplier.address
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      const newSupplier = await addNewSupplier(supplier.id, values.firstName, values.lastName, values.email, values.contactNumber, resultCity.city, resultProvince, values.companyName, values.website, values.address, session.access_token);
      if (newSupplier.status !== false) {
          console.log(newSupplier.data);
          history.back();
      } 
      else if (newSupplier.status === false) {
        console.log(newSupplier.message);
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
          >
            Update Supplier
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
