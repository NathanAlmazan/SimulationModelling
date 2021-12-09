import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import AddCategory from './AddCatetgory';
import CategoryDialog from './CategoryDialog';

function ProductInfo(props) {
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [categorySettings, setCategorySettings] = useState(false);
    const { product, textChange, priceChange, stockChange, categories, token, refresh, profile, disableStock } = props;
    const { name, category, barCode, price, stocks } = product;

    return (
        <Card sx={{ p: 5 }}>
            <Stack direction="column" spacing={3}>
                {!profile ? (
                    <TextField 
                        required
                        disabled={profile}
                        fullWidth
                        name="name"
                        label="Product Name"
                        variant="standard"
                        value={name}
                        onChange={event => textChange(event)}
                    />
                ) : (
                    <TextField 
                        fullWidth
                        name="name"
                        label="Product Name"
                        variant="standard"
                        value={name}
                    />
                )}
                

                {!profile ? (
                    <Stack direction="row" spacing={1}>
                        <TextField 
                            required
                            fullWidth
                            select
                            name="category"
                            label="Product Category"
                            variant="standard"
                            value={category}
                            onChange={event => textChange(event)}
                        >
                        {categories.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                        </TextField>
                    
                        <IconButton onClick={() => setCategoryDialog(true)}>
                            <AddCircleIcon />
                        </IconButton>
                        <IconButton onClick={() => setCategorySettings(true)} disabled={category === ""}>
                            <SettingsIcon />
                        </IconButton>
                    </Stack>

                ) : (
                    <TextField 
                        fullWidth
                        name="category_name"
                        label="Category"
                        variant="standard"
                        value={category}
                    />
                )}

                {!profile ? (
                    <TextField 
                        fullWidth
                        disabled={profile}
                        name="barCode"
                        label="Bar Code"
                        variant="standard"
                        value={barCode}
                        onChange={event =>  textChange(event)}
                    />
                ) : (
                    <TextField 
                        fullWidth
                        name="barCode"
                        label="Bar Code"
                        variant="standard"
                        value={!barCode ? "" : barCode}
                    />
                )}
                
                
                <Stack direction="row" spacing={2}>
                    {!profile ? (
                        <TextField 
                            required
                            sx={{ width: "50%" }}
                            name="stocks"
                            type="number"
                            inputProps={{ min: 0 }}
                            label="Items in Stock"
                            variant="standard"
                            value={stocks}
                            onChange={event => stockChange(event)}
                        />
                    ) : (
                        <TextField 
                            sx={{ width: "50%" }}
                            name="stocks"
                            label="Items in Stock"
                            variant="standard"
                            value={stocks}
                        />
                    )}
                    
                    {!profile ? (
                        <TextField 
                            required
                            disabled={profile}
                            sx={{ width: "50%" }}
                            name="price"
                            label="Price in Peso"
                            type="number"
                            inputProps={{ min: 0, step: ".05" }}
                            variant="standard"
                            value={price}
                            onChange={event => priceChange(event)}
                        />
                    ): (
                        <TextField 
                            sx={{ width: "50%" }}
                            name="price"
                            label="Price in Peso"
                            variant="standard"
                            value={price}
                        />
                    )}
                    
                </Stack>
            </Stack>

            <AddCategory 
                open={categoryDialog}
                handleClose={() => setCategoryDialog(false)}
                token={token}
                refresh={() => refresh()}
            />

            {!profile &&  (
                <CategoryDialog 
                    open={categorySettings}
                    setOpen={value => setCategorySettings(value)}
                    categoryId={category}
                    categories={categories}
                    accessToken={token}
                    refresh={() => refresh()}
                />
            )}
            
        </Card>
    )
}

export default ProductInfo
