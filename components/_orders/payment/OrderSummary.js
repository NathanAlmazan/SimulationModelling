import React from 'react';
// material
import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const PrimaryStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const SecondaryStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: theme.palette.error.darker,
    backgroundColor: theme.palette.error.lighter
  }));

// ----------------------------------------------------------------------

export default function OrderSummary(props) {
    const { variant, value } = props;

    if (variant === "daysLeft") return (
        <SecondaryStyle>
            <Typography variant="h3">{value < 0 ? Math.abs(parseInt(value)) : parseInt(value)}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                {value < 0 ? "Days Overdue" : "Days Left"}
            </Typography>
        </SecondaryStyle>
    );

  return (
    <PrimaryStyle>
      <Typography variant="h3">{"₱ " + value.toFixed(2)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Order Balance
      </Typography>
    </PrimaryStyle>
  );
}
