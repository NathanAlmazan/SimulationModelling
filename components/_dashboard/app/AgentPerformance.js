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

export default function AppConversionRates({ data, date, setDate }) {
  const [values, setValues] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let currValues = [];
    let currCategory = [];

    data.forEach(d => {
      currValues.push(d.total_sales);
      currCategory.push(d.agent_name);
    });

    setValues(state => currValues);
    setCategories(state => currCategory);

  }, [data])

  const CHART_DATA = [{ data: values }];
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => `₱ ${seriesName.toFixed(2)}`,
        title: {
          formatter: (seriesName) => 'Total Sales'
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

  const handleDateChange = (event) => {
    if (event === "next") {
      if (!date) {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);

        setDate(currentDate.toISOString());
      } else {
        const currentDate = new Date(date);
        currentDate.setFullYear(currentDate.getFullYear() + 1);

        setDate(currentDate.toISOString());
      }
    } else {
      if (!date) {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 1);

        setDate(currentDate.toISOString());
      } else {
        const currentDate = new Date(date);
        currentDate.setFullYear(currentDate.getFullYear() - 1);

        setDate(currentDate.toISOString());
      }
    }
  }

  return (
    <Card>
      <CardHeader 
        title="Sales Agents" 
        subheader={!date ? `Year ${new Date().getFullYear()}` : `Year ${new Date(date).getFullYear()}`}
        action={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton onClick={() => handleDateChange("back")}>
                <KeyboardArrowLeftIcon  />
              </IconButton>
              <IconButton onClick={() => handleDateChange("next")}>
                <KeyboardArrowRightIcon />
              </IconButton>
          </Stack>
        }  
      />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
