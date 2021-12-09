import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
  });


function ProductImage(props) {
    const { onImageChange, imageFile, imageName, profile } = props;
    const [imageSource, setImageSource] = useState(null);
    const baseURL = API_CLIENT_SIDE();

    useEffect(() => {
        if (imageFile !== null) {
            let reader = new FileReader();
            let imageURL = reader.readAsDataURL(imageFile);

            reader.onloadend = function (e) {
                setImageSource([reader.result]);
            };

        }
    }, [imageFile])

    return (
        <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <ProductImgStyle alt="product image" src={imageFile !== null ? imageSource : imageName !== null ? imageName :  "https://drive.google.com/uc?id=1_Cl5hghtYvVvTP-1hE4gJpzSIqXABvRY&export=download"} />
                    {!profile && (
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<ImageSearchTwoToneIcon />}
                            sx={{
                                zIndex: 9,
                                bottom: 16,
                                right: 16,
                                position: 'absolute',
                                textTransform: 'uppercase'
                            }}
                        >
                            Change Image
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={event => onImageChange(event)}
                                hidden 
                            />
                        </Button>
                    )}
            </Box>
        </Card>
    )
}

export default ProductImage
