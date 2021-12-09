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

function ProductDesc(props) {
    const { openDialog, descriptions, removeDesc, profile } = props;

    return (
        <Card sx={{ p: 3 }}>
            <HeadStyle>
                <Typography component="div" variant="subtitle1">
                    Descriptions
                </Typography>
                {!profile && (
                    <Tooltip title="Filter list">
                        <IconButton onClick={() => openDialog()} >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </HeadStyle>
            <Scrollbar sx={{ overflowY: 'auto', height: 200 }}>
                {descriptions.map((value, index) => {
                    const { type, text_value } = value;

                    if (profile === true) return (
                        <TextField 
                            key={index}
                            sx={{ mb: 3 }}
                            fullWidth
                            variant="standard"
                            name="annotate"
                            label={type}
                            value={text_value}
                        />
                    );

                    return (
                        <TextField 
                            key={index}
                            sx={{ mb: 3 }}
                            fullWidth
                            variant="standard"
                            name="annotate"
                            label={type}
                            value={text_value}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                      <IconButton onClick={event => removeDesc(event, index)}>
                                        <CloseIcon />
                                      </IconButton>
                                  </InputAdornment>
                                ),
                            }}
                        />
                    )
                })}

                {descriptions.length === 0 && (
                    <Typography component="div" variant="subtitle2" sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                        No Recorded Descriptions
                    </Typography>
                )}
                
            </Scrollbar>
        </Card>
    )
}

export default ProductDesc
