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
      data: [1200, 5680, 2150, 872, 1966, 6120, 3921, 2745, 1906, 4892, 5430, 2500]
    },
    {
      name: 'Total Payables',
      type: 'line',
      data: [500, 100, 950, 100, 3100, 200, 340, 1560, 901, 560, 3000, 120]
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['gradient', 'solid'] },
    labels: [
      "2021-11-07T00:00:00.000Z",
      "2021-11-14T00:00:00.000Z",
      "2021-11-21T00:00:00.000Z",
      "2021-11-28T00:00:00.000Z",
      "2021-12-05T00:00:00.000Z",
      "2021-12-12T00:00:00.000Z",
      "2021-12-19T00:00:00.000Z",
      "2021-12-26T00:00:00.000Z",
      "2022-01-02T00:00:00.000Z",
      "2022-01-09T00:00:00.000Z",
      "2022-01-16T00:00:00.000Z",
      "2022-01-23T00:00:00.000Z"
    ],
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
