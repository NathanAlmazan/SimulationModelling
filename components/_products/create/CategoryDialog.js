import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import axios from 'axios';

export default function FormDialog(props) {
  const { open, setOpen, categoryId, categories, accessToken, refresh } = props;
  const [currCategory, setCategory] = React.useState({
      name: '',
      description: ''
  });
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const currCateg = categories.find(obj => obj.id === categoryId);
    if (currCateg) {
        setCategory(state => ({ ...state, name: currCateg.name, description: currCateg.description }))
    }
  }, [categories, categoryId]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTextChange = (event) => {
    setCategory({ ...currCategory, [event.target.name]: event.target.value });
  }

  const handleUpdate = async () => {
    const baseURL = API_CLIENT_SIDE();
    try {

        await axios({
          url: `${baseURL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + accessToken,
          },
          data: {
            query: `
              mutation UpdateCategory ($ID: Int!, $Name: String, $Desc: String) {
                updateCategory (id: $ID, name: $Name, description: $Desc) {
                  id
                }
              }
            `,
            variables: {
                ID: categoryId,
                Name: currCategory.name,
                Desc: currCategory.description
            }
          }
        });

        refresh();
        setError(null);
        setOpen(false);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.errors[0].message);
      } else {
        console.log(err);
        setError("Alert: Server is probably down.");
      }
    }
  }

  const handleDelete = async () => {
    const baseURL = API_CLIENT_SIDE();
    try {

        await axios({
          url: `${baseURL}/product/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + accessToken,
          },
          data: {
            query: `
              mutation DeleteCategory ($ID: Int!) {
                deleteCategory (id: $ID) {
                  id
                }
              }
            `,
            variables: {
                ID: categoryId
            }
          }
        });

        refresh();
        setError(null);
        setOpen(false);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.errors[0].message);
      } else {
          console.log(err);
        setError("Alert: Server is probably down.");
      }
    }
  }

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Category Manager</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This dialog allows you to edit or delete a category. You cannot delete a category that already contains products.
          </DialogContentText>
        <br/>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Name"
            value={currCategory.name}
            fullWidth
            name="name"
            variant="standard"
            onChange={handleTextChange}
            error={error != null}
            helperText={error}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            name="description"
            value={currCategory.description}
            fullWidth
            variant="standard"
            onChange={handleTextChange}
            error={error != null}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
            <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
  );
}
