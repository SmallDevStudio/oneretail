import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import 'dayjs/locale/th';

export default function CalendarEvents() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} locale="th">
      <DateCalendar />
    </LocalizationProvider>
  );
}