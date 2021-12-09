import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import axios from 'axios';

export default function AddCategory(props) {
    const { handleClose, open, token, refresh } = props;
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
      name: "",
      description: ""
    });
    const { name, description } = formData;

    const handleSubmit = async (event) => {
      event.preventDefault();
      const baseURL = API_CLIENT_SIDE();
      try {
        const response = await axios({
            url: `${baseURL}/product/graphql`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + token
            },
            data: {
              query: `
                mutation AddProductCategory ($Name: String!, $Desc: String!) {
                    addCategory (name: $Name, description: $Desc) {
                        id
                    }
                }
              `,
              variables: {
                Name: name,
                Desc: description
              }
            }
        });
  
        const newCategory = response.data.data;
        if (newCategory.addCategory !== null) {
            handleClose();
            refresh();
        } else {
            setError(newCategory.errors[0].messasge);
        }
  
      } catch (err) {
          if (!err.response) {
            setError("Server is probably down.");
          } else {
            setError(err.response.data.errors[0].message);
          }
      }
    } 

  return (
      <Dialog open={open} onClose={() => handleClose()}>
        <form onSubmit={handleSubmit}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>

           <TextField
                sx={{ mb: 2 }}
                required
                name="text_value"
                label="Category Name"
                fullWidth
                variant="standard"
                value={name}
                onChange={event => setFormData({ ...formData, name: event.target.value })}
                error={Boolean(error !== null)}
                helperText={error !== null && error}
          />

            <TextField
                sx={{ mb: 2 }}
                required
                name="text_value"
                label="Description"
                fullWidth
                variant="standard"
                value={description}
                onChange={event => setFormData({ ...formData, description: event.target.value })}
                error={Boolean(error !== null)}
                helperText={error !== null && error}
          />

        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => handleClose()}>Cancel</Button>
          <Button type="submit" >Save</Button>
        </DialogActions>
        </form>
      </Dialog>
  );
}
