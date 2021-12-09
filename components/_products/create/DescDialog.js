import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const DescriptionType = [
  "Color",
  "Pattern",
  "Material",
  "Manufacturer",
  "Coating"
]

export default function DescDialog(props) {
    const { handleClose, open, addDescription } = props;
    const filter = createFilterOptions();
    const [formData, setFormData] = useState({
      type: "",
      text_value: ""
    });
    const { type, text_value } = formData;

    const handleSubmit = (event) => {
      event.preventDefault();
      addDescription(formData);
      setFormData({ ...formData, type: "", text_value: "" });
      handleClose();
    } 

  return (
      <Dialog open={open} onClose={() => handleClose()}>
        <form onSubmit={handleSubmit}>
        <DialogTitle>Add Product Description</DialogTitle>
        <DialogContent>
          <Autocomplete
            value={type}
            onChange={(event, newValue) => {
              setFormData({ ...formData, type: newValue });
            }}
            options={DescriptionType}
            isOptionEqualToValue={(option, value) => option === value}
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
            sx={{ mb: 2 }}
            renderInput={(params) => 
              <TextField {...params}
                required
                name="type"
                label="Description Type"
                variant="standard"
              />
            }
          />

           <TextField
            sx={{ mb: 2 }}
            required
            name="text_value"
            label="Value"
            fullWidth
            variant="standard"
            value={text_value}
            onChange={event => setFormData({ ...formData, text_value: event.target.value })}
          />

        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={() => handleClose()}>Cancel</Button>
          <Button type="submit" variant="contained" >Save</Button>
        </DialogActions>
        </form>
      </Dialog>
  );
}
