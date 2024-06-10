// components/Calendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import Modal from './Modal';
import axios from 'axios';

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
        <div>
            <Calendar
                onChange={onDateChange}
                value={date}
                locale="th-TH"
            />
            <div>
                {weekEvents.map(event => (
                    <div key={event._id} onClick={() => onEventClick(event)}>
                        <h3>{moment(event.startDate).format('D MMMM')} : {event.title}</h3>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
            {modalVisible && (
                <Modal onClose={() => setModalVisible(false)}>
                    <h2>{selectedEvent.title}</h2>
                    <p>{selectedEvent.description}</p>
                    <p>{selectedEvent.place}</p>
                    <p>{moment(selectedEvent.startDate).format('LL')} - {moment(selectedEvent.endDate).format('LL')}</p>
                    <p>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                    <p>{selectedEvent.mapLocation}</p>
                </Modal>
            )}
        </div>
    );
};

export default CustomCalendar;
