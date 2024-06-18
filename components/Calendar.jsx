// components/Calendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import Modal from './Modal';
import axios from 'axios';
import 'moment/locale/th';
import Image from 'next/image';
import Link from 'next/link';

moment.locale('th');

const CustomCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekEvents, setWeekEvents] = useState({});
    console.log(selectedEvent);

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await axios.get('/api/events');
            setEvents(response.data.data);

            // Set week events for the current week
            const currentDate = new Date();
            const startOfWeek = moment(currentDate).startOf('isoWeek').toDate();
            const endOfWeek = moment(currentDate).endOf('isoWeek').toDate();
            const currentWeekEvents = response.data.data.filter(event => {
                const eventDate = new Date(event.startDate);
                return eventDate >= startOfWeek && eventDate <= endOfWeek;
            });
            setWeekEvents(groupEventsByDate(currentWeekEvents));
        };
        fetchEvents();
    }, []);

    const onDateChange = (date) => {
        setDate(date);
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.startDate);
            return moment(eventDate).isSame(date, 'day');
        });
        setWeekEvents(groupEventsByDate(dayEvents));
    };

    const onEventClick = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.startDate);
                return moment(eventDate).isSame(date, 'day');
            });
            return dayEvents.length > 0 ? <div className="bullet"></div> : null;
        }
    };

    const groupEventsByDate = (events) => {
        const groupedEvents = {};
        events.forEach(event => {
            const eventDate = moment(event.startDate).format('YYYY-MM-DD');
            if (!groupedEvents[eventDate]) {
                groupedEvents[eventDate] = [];
            }
            groupedEvents[eventDate].push(event);
        });
        return groupedEvents;
    };

    return (
        <div className='flex flex-col items-center justify-center w-full'>
            <Calendar
                onChange={onDateChange}
                value={date}
                locale="th-TH"
                showFixedNumberOfWeeks={true}
                tileContent={renderTileContent}
            />
            {Object.keys(weekEvents).length > 0 && (
                <div className='min-w-[100%] p-2 border-2 border-[#0056FF]/80 rounded-3xl mt-2 pl-5 pr-5'>
                    {Object.keys(weekEvents).map(date => (
                        <div key={date}>
                            <h3 className='font-black text-lg mt-2'>{moment(date).format('D MMMM YYYY')}</h3>
                            {weekEvents[date].map(event => (
                                <div key={event._id} onClick={() => onEventClick(event)}>
                                    <span className='text-sm font-bold'>{event.title}</span>
                                    <div className='flex items-center mt-1'>
                                        <span className='text-xs'>({moment(event.endDate).diff(moment(event.startDate), 'days') + 1} วัน)</span>
                                        <span className='text-[10px] text-gray-400 ml-2'>คลิกเพื่อดูรายละเอียด</span>
                                    </div>
                                    <p className='text-sm mb-3 text-ellipsis'>{event.description}</p>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            {modalVisible && (
                <Modal onClose={() => setModalVisible(false)} style={{ }}>
                    <div className='w-full p-2 '>
                        
                        <span className='font-bold text-lg text-[#0056FF]'>{selectedEvent.title}</span>
                        {selectedEvent.No && <span className='text-sm font-bold text-[#F68B1F] ml-2 '>(รุ่นที่ {selectedEvent.No})</span>}
                     
                        <p className='text-sm text-[#0056FF]'>
                            {moment(selectedEvent.startDate).format('LL')}
                            {moment(selectedEvent.startDate).isSame(selectedEvent.endDate, 'day') 
                                ? '' 
                                : ` - ${moment(selectedEvent.endDate).format('LL')}`}
                        </p>
                        <p className='text-sm'>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                        <p className='text-md mb-5'>{selectedEvent.description}</p>
                        <div className='flex flex-row gap-2 items-center'>
                            <span className='text-sm text-[#F68B1F]'>
                                <Image
                                    src="/images/other/location-01.svg"
                                    alt="avatar"
                                    width={20}
                                    height={20}
                                    className='rounded-full'
                                />
                                {selectedEvent.location}
                            </span>
                            <Link href={selectedEvent.link? selectedEvent.link : '#'} target={selectedEvent.link? '_blank' : '_self'}>
                                <p className='text-sm font-bold'>{selectedEvent.mapLocation} - {selectedEvent.place}</p>
                            </Link>
                        </div>
                    </div>
                </Modal>
            )}
            <style jsx>{`
                .bullet {
                    width: 10px;
                    height: 10px;
                    background-color: #29b6f6;
                    border-radius: 50%;
                    margin: 2px auto;
                }
                /* Hide the last week row to show only 5 weeks */
                .react-calendar__month-view__weeks__week:nth-last-child(1) {
                    display: none;
                }
            `}</style>

        </div>
    );
};

export default CustomCalendar;
