import 'date-fns';
import React from 'react';
import Grid from '@mui/material/Grid';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
export default function MaterialUIPickers({ setSelectedDate, selectedDate }) {
  // The first commit of Material-UI

  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid
        container
        justifyContent='space-around'
        style={{ width: '100%', paddingLeft: '10px', paddingBottom: '15px' }}>
        <DesktopDatePicker
          label='Date paid'
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
    </LocalizationProvider>
  );
}
