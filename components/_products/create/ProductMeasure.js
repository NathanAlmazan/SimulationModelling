import React from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Scrollbar from '../../Scrollbar';
import Toolbar from '@mui/material/Toolbar';

const HeadStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 0, 0, 3)
  }));

function ProductMeasure(props) {
    const { openDialog, measurements, removeMeasure, profile } = props;

    return (
        <Card sx={{ p: 3 }}>
            <HeadStyle>
                <Typography component="div" variant="subtitle1">
                    Measurments
                </Typography>
                {!profile && (
                    <Tooltip title="Filter list">
                        <IconButton onClick={() => openDialog()}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </HeadStyle>
            <Scrollbar sx={{ overflowY: 'auto', height: 200 }}>
                {measurements.map((value, index) => {
                    const { type, num_value, unit } = value;

                    if (profile === true) return (
                        <TextField 
                            key={index}
                            sx={{ width: "45%", mb: 3, mr: 2 }}
                            variant="standard"
                            name="annotate"
                            label={type}
                            value={num_value.toFixed(2) + " " + unit.split(' ')[0]}
                        />
                    )

                    return (
                        <TextField 
                            key={index}
                            sx={{ width: "45%", mb: 3, mr: 2 }}
                            variant="standard"
                            name="annotate"
                            label={type}
                            value={num_value.toFixed(2) + " " + unit.split(' ')[0]}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                      <IconButton onClick={event => removeMeasure(event, index)}>
                                        <CloseIcon />
                                      </IconButton>
                                  </InputAdornment>
                                ),
                            }}
                        />
                    )
                })}

                {measurements.length === 0 && (
                    <Typography component="div" variant="subtitle2" sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                         No Recorded Measurements
                    </Typography>
                )}
                
            </Scrollbar>
        </Card>
    )
}

export default ProductMeasure
