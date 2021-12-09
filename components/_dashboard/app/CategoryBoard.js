import React, { useState, useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
//
import BaseOptionChart from './BaseOptionChart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------


export default function AppCurrentSubject({ data, date, setDate }) {
  const theme = useTheme();
  const [values, setValues] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let currValues = [];
    let currCategory = [];

    data.forEach(d => {
      currValues.push(d.total_sold);
      currCategory.push(d.category_name);
    });

    setValues(state => currValues);
    setCategories(state => currCategory);

  }, [data]);

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


  const CHART_DATA = [
    { name: 'Product Data', data: values }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 2 },
    fill: { opacity: 0.48 },
    legend: { floating: true, horizontalAlign: 'center' },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: [
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary
          ]
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader 
        title="Product Statistics" 
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
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="radar" series={CHART_DATA} options={chartOptions} height={340} />
      </ChartWrapperStyle>
    </Card>
  );
}
