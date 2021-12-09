import React, { useState, useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader, Stack, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
//
import BaseOptionChart from './BaseOptionChart';

// ----------------------------------------------------------------------

export default function AppConversionRates({ data }) {
  const [values, setValues] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let currValues = [];
    let currCategory = [];

    data.forEach(d => {
      currValues.push(d.stocks);
      currCategory.push(d.name);
    });

    setValues(state => currValues);
    setCategories(state => currCategory);

  }, [data])

  const CHART_DATA = [{ data: values }];
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => seriesName,
        title: {
          formatter: (seriesName) => 'Items:'
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: categories
    }
  });

  return (
    <Card>
      <CardHeader 
        title="Products Status" 
      />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
