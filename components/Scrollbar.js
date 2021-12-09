import React from 'react';
import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object
};

export default function Scrollbar({ children, sx, ...other }) {

  return (
    <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
    </Box>
  );
}
