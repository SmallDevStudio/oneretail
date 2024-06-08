import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';
import axios from 'axios';

const Training = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-4">
      <div className='flex justify-center items-center w-full mt-5 mb-3'>
        <h1 className="text-3xl font-bold mb-4 text-[#0056FF]">ตารางการอบรม</h1>
      </div>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale={thLocale}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.2} // Adjust aspect ratio for mobile view
          eventClick={(info) => {
            const eventId = info.event.id;
            window.location.href = `/training/${eventId}`;
          }}
          fixedWeekCount={true}
          views={{
            dayGridMonth: {
              dayMaxEventRows: 3, // adjust to show more or fewer events
              moreLinkClick: 'popover' // display more events in a popover
            }
          }}
        />
      </div>
      {/* Add more content as needed */}
      <div>
        
      </div>
    </div>
  );
};

export default Training;