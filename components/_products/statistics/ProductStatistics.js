import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, IconButton, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

//
import BaseOptionChart from '../../_dashboard/app/BaseOptionChart';

// ----------------------------------------------------------------------

export default function ProductStatistics(props) {
  const { salesHistory, purchaseHistory, changeYear, currentYear } = props;

  const CHART_DATA = [
    {
      name: 'Sold',
      type: 'area',
      data: salesHistory
    },
    {
      name: 'Purchased',
      type: 'line',
      data: purchaseHistory
    }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['gradient', 'solid'] },
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    xaxis: { type: 'string' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} items`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader 
        title="Product Statistics" 
        subheader={currentYear !== null ? "Year " + currentYear : "Year " + new Date().getFullYear()} 
        action={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton onClick={event => changeYear(event, "back")}>
                <KeyboardArrowLeftIcon  />
              </IconButton>
              <IconButton onClick={event => changeYear(event, "next")}>
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
