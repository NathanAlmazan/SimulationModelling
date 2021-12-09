import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const unitMeasurements = [
  "(m) meters",
  "(mm) millimeters",
  "(cm) centimeters",
  "(dm) decimeters",
  "(dam) dekameters",
  "(hm) hectometers",
  "(km) kilometers",
  "(in) inches",
  "(ft) feet/foot",
  "(yd) yards",
  "(mi) miles",
  "(oz) ounce",
  "(lb) pounds",
  "(T) tons",
  "(mg) milligrams",
  "(g) grams",
  "(kg) kilograms",
  "(mt) metric tons",
  "(ml) milliliters",
  "(dl) deciliters",
  "(cl) centiliters",
  "(l) liters",
  "(gal) gallons",
  "(tbsp) tablespoon",
  "(c) cups",
  "(kl) kiloliters",
  "(s) seconds",
  "(min) minutes",
  "(hr) hours"
]

const MeasurementType = [
  "Height",
  "Width",
  "Depth",
  "Weight",
  "Length",
  "Circumference",
  "Diameter",
  "Radius",
  "Volume",
  "Capacity"
]

export default function MeasureDialog(props) {
    const { handleClose, open, addMeasurement } = props;
    const filter = createFilterOptions();
    const [formData, setFormData] = useState({
      type: "",
      num_value: "",
      unit: ""
    });
    const { type, num_value, unit } = formData;

    const handleSubmit = (event) => {
      event.preventDefault();
      addMeasurement(formData);
      setFormData({ ...formData, type: "", num_value: "", unit: "" });
      handleClose();
    } 

  return (
      <Dialog open={open} onClose={() => handleClose()}>
        <form onSubmit={handleSubmit}>
        <DialogTitle>Add Product Measurement</DialogTitle>
        <DialogContent>
            <Autocomplete
              value={type}
              onChange={(event, newValue) => {
                setFormData({ ...formData, type: newValue });
              }}
              options={MeasurementType}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
        
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue === '' || !isExisting) {
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
                  label="Measurement Type"
                  variant="standard"
                />
              }
            />

            <TextField
              sx={{ mb: 2 }}
              required
              fullWidth
              name="num_value"
              label="Value"
              type="number"
              inputProps={{ min: '.05', step: '.05' }}
              variant="standard"
              value={num_value}
              onChange={event => setFormData({ ...formData, num_value: event.target.value !== "" ? parseFloat(event.target.value) : "" })}
            />
             <Autocomplete
              value={unit}
              onChange={(event, newValue) => {
                setFormData({ ...formData, unit: newValue });
              }}
              options={unitMeasurements}
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
                  name="unit"
                  label="Units"
                  variant="standard"
                />
              }
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
