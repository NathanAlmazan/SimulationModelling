import React, { useState, useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, Stack, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
//
import BaseOptionChart from './BaseOptionChart';

// ----------------------------------------------------------------------

export default function AppWebsiteVisits({ data, date, setDate }) {
  const [categories, setCategory] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [creditValues, setCreditValues] = useState([]);
  const options = { month: 'long', year: 'numeric' };

  const handleDateChange = (event) => {
    if (event === "next") {
      if (!date) {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);

        setDate(currentDate.toISOString());
      } else {
        const currentDate = new Date(date);
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);

        setDate(currentDate.toISOString());
      }
    } else {
      if (!date) {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentDate.setDate(1);

        setDate(currentDate.toISOString());
      } else {
        const currentDate = new Date(date);
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentDate.setDate(1);

        setDate(currentDate.toISOString());
      }
    }
  }

  useEffect(() => {
    let categ = [];
    let salesVals = [];
    let creditVals = [];

    data.forEach(d => {
      categ.push(new Date(d.start_date).toLocaleDateString());
      salesVals.push(d.total_sales);
      creditVals.push(d.total_purchase);
    });

    setCategory(state => categ);
    setSalesValues(state => salesVals);
    setCreditValues(state => creditVals);

  }, [data]);

  const CHART_DATA = [
    {
      name: 'Total Receivables',
      type: 'area',
      data: salesValues
    },
    {
      name: 'Total Payables',
      type: 'line',
      data: creditValues
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['gradient', 'solid'] },
    labels: categories,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `₱ ${y.toFixed(2)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader 
        title="Sales Report" 
        subheader={!date ? new Date().toLocaleDateString(undefined, options) : new Date(date).toLocaleDateString(undefined, options)} 
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
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
