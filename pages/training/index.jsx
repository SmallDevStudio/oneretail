import React from 'react';
import AppLayout from '@/themes/Layout/AppLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventCard from '@/components/admin/formTable/EventCard';
import EventList from '@/components/admin/formTable/EventList';
import Modal from 'react-modal';

const Training = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [groupFilter, setGroupFilter] = useState('showall');
  
    useEffect(() => {
      fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, groupFilter]);
  
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const filteredEvents = response.data.data.filter(event => 
          (groupFilter === 'showall' || event.group === groupFilter)
        );
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    const handleDayClick = (value, event) => {
      const selectedDayEvents = events.filter(e => 
        new Date(e.startdate).toDateString() === value.toDateString()
      );
      if (selectedDayEvents.length > 0) {
        setSelectedEvent(selectedDayEvents);
        setModalIsOpen(true);
      }
    };
  
    return (
      <div className="relative p-4 mb-20">
        <div className="flex flex-col items-center text-center justify-center p-2 px-1 pz-1">
            <span className="text-3xl font-bold text-[#0056FF] mt-5 mb-3">
                ตารางการอบรม
            </span>
            <div className='w-full ml-5 mr-5'>
                <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                locale="th-TH"
                onClickDay={handleDayClick}
                />
                <div className="text-sm justify-end text-end">
                    <label>กรองตามกลุ่ม: </label>
                    <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
                        <option value="showall">แสดงทั้งหมด</option>
                        <option value="group1">กลุ่ม 1</option>
                        <option value="group2">กลุ่ม 2</option>
                        <option value="group3">กลุ่ม 3</option>
                    </select>
                </div>
            </div>
            <div className="w-full p-2 text-left">
                <EventList events={events} />
            </div>
            
            {modalIsOpen && (
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                {selectedEvent.map(event => (
                <EventCard key={event._id} event={event} />
                ))}
                <button onClick={() => setModalIsOpen(false)}>ปิด</button>
            </Modal>
            )}
        </div>
      </div>
    );
  };
  
  

Training.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
}

Training.auth = true

export default Training;