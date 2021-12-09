import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// material
import { Card, Typography, CardHeader, CardContent, Stack, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';
import Scrollbar from '../../Scrollbar';

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (type === 'order1' && 'primary.main') ||
              (type === 'order2' && 'secondary.main') ||
              (type === 'order3' && 'success.main') ||
              (type === 'order4' && 'info.dark') ||
              (type === 'order5' && 'warning.main') ||
              (type === 'order6' && 'success.light') ||
              'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {time}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AppOrderTimeline({ data, date, setDate }) {
  const [eventList, setEvents] = useState([]);
  const [firstDay, setFirstDay] = useState(null);
  const [lastDay, setLastDay] = useState(null);
  const option2 = { month: 'short', day: 'numeric' };

  useEffect(() => {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      
      let currEvents = [];

      data.forEach((d, index) => {
        if (d.due_credits !== 0 || d.due_orders !== 0) {
          if (d.due_credits !== 0 && d.due_orders !== 0) {
            const eventInfo = { title: `${d.due_orders} ${d.due_orders > 1 ? 'orders' : 'order'} due, ${d.due_credits} ${d.due_orders > 1 ? 'credits' : 'credit'} due`, 
                time: new Date(d.start_date).toLocaleDateString(undefined, options), type: `order${index}` };
          
            currEvents.push(eventInfo);
          } else if (d.due_credits !== 0) {
            const eventInfo = { title: `${d.due_credits} ${d.due_orders > 1 ? 'credits' : 'credit'} due`, 
                time: new Date(d.start_date).toLocaleDateString(undefined, options), type: `order${index}` };
          
            currEvents.push(eventInfo);
          } else if (d.due_orders !== 0) {
            const eventInfo = { title: `${d.due_orders} ${d.due_orders > 1 ? 'orders' : 'order'} due`, 
                time: new Date(d.start_date).toLocaleDateString(undefined, options), type: `order${index}` };
          
            currEvents.push(eventInfo);
          }
        }
      });

      setEvents(state => currEvents);
    
  }, [data]);

  useEffect(() => {
    const currDate = !firstDay ? new Date() : new Date(firstDay);
    const firstday = new Date(currDate.setDate(currDate.getDate() - currDate.getDay()));
    const lastday = new Date(currDate.setDate(firstday.getDate() + 6));

    setFirstDay(state => firstday.toISOString());
    setLastDay(state => lastday.toISOString());
  }, [firstDay])

  const handleDateChange = (event) => {
    if (event === "next") {
      const currentDate = new Date(lastDay);
      currentDate.setDate(currentDate.getDate() + 2);

      setDate(currentDate.toISOString());
      setFirstDay(currentDate.toISOString());
      
    } else {
      const currentDate = new Date(firstDay);
      currentDate.setDate(currentDate.getDate() - 6);

      setDate(currentDate.toISOString());
      setFirstDay(currentDate.toISOString());
    }
  }

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader 
        title="Order Timeline" 
        subheader={new Date(firstDay).toLocaleDateString(undefined, option2) + ' to ' + new Date(lastDay).toLocaleDateString(undefined, option2)}
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
      <CardContent>
        <Scrollbar sx={{ overflowY: 'auto', maxHeight: 345 }}>
          <Timeline>
            {eventList.map((item, index) => (
              <OrderItem key={item.title} item={item} isLast={index === eventList.length - 1} />
            ))}
            {eventList.length === 0 && (
              <Typography variant="subtitle2" align="center">
                No Events Found
              </Typography>
            )}
          </Timeline>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}
