// components/Calendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import Modal from './Modal';
import axios from 'axios';
import { FaMapMarkerAlt } from "react-icons/fa";

const CustomCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekEvents, setWeekEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await axios.get('/api/events');
            setEvents(response.data.data);
        };
        fetchEvents();
    }, []);

    const onDateChange = (date) => {
        setDate(date);
        const startOfWeek = moment(date).startOf('week').toDate();
        const endOfWeek = moment(date).endOf('week').toDate();
        const weekEvents = events.filter(event => {
            const eventDate = new Date(event.startDate);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
        setWeekEvents(weekEvents);
    };

    const onEventClick = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full'>
            <Calendar
                onChange={onDateChange}
                value={date}
                locale="th-TH"
                showFixedNumberOfWeeks={true}
                style={{ width: '100%' }}
            />
            <div className='min-w-[100%] p-2 border-2 border-[#0056FF]/80 rounded-xl mt-2 pl-5 pr-5'>
                {weekEvents.map(event => (
                    <div key={event._id} onClick={() => onEventClick(event)}
                        className=''
                    >
                        <h3 className='font-black text-lg'>{moment(event.startDate).format('D MMMM')} </h3>
                        <span className='text-sm font-bold'>{event.title}</span>
                        <p className='text-sm mb-3 text-ellipsis'>{event.description}</p>
                        <hr />
                    </div>
                ))}
            </div>
            {modalVisible && (
                <Modal onClose={() => setModalVisible(false)} style={{ }}>
                    <div className='w-full p-2 '>
                    <h2 className='font-bold text-2xl text-[#0056FF]'>{selectedEvent.title}</h2>
                    <p className='text-sm text-[#0056FF]'>{moment(selectedEvent.startDate).format('LL')} - {moment(selectedEvent.endDate).format('LL')}</p>
                    <p className='text-sm'>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                    <p className='text-md mb-5'>{selectedEvent.description}</p>
                    <span className='text-sm text-[#F68B1F]'><FaMapMarkerAlt /> {selectedEvent.location}</span>
                    <p className='text-sm font-bold'>{selectedEvent.mapLocation} - {selectedEvent.place}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CustomCalendar;
