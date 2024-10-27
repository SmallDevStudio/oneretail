// components/Calendar.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import Modal from './Modal';
import axios from 'axios';
import 'moment/locale/th';
import Image from 'next/image';
import Link from 'next/link';
import Loading from './Loading';

moment.locale('th');

const CustomCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [user, setUser] = useState({});
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekEvents, setWeekEvents] = useState({});

    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    useEffect(() => {
        setLoading(true);
        if (userId) {
            const fetcherUser = async () => {
                try {
                    const response = await axios.get(`/api/users/${userId}`);
                    setUser(response.data.user);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }

            fetcherUser();
        }
    }, [userId]);

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

    const getChannelColor = (channel) => {
        switch (channel) {
            case 'AL':
                return 'bg-[#0056FF]';
            case 'BBD':
                return 'bg-[#F68B1F]';
            default:
                return 'bg-gray-500';
        }
    };

    console.log(user);

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
                            <h3 className='font-black text-lg mt-2 text-[#0056FF]'>{moment(date).format('D MMMM YYYY')}</h3>
                            {weekEvents[date].map(event => (
                                <div key={event._id} onClick={() => onEventClick(event)}>
                                    <span className='text-sm font-bold'>{event.title}</span>
                                    <span className='text-xs ml-1'>({moment(event.endDate).diff(moment(event.startDate), 'days') + 1} วัน)</span>
                                    <div className='flex items-center'>
                                        <span className='text-sm font-bold mr-1'>Channel:</span>
                                        <span className={`text-sm font-bold text-white rounded-lg pl-1 pr-1 ${getChannelColor(event.channel)}`}>{event.channel}</span>
                                        <span className='text-[10px] text-gray-400 ml-2'>(คลิกเพื่อดูรายละเอียด)</span>
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
                        {selectedEvent.No && <span className='text-sm font-bold text-[#F68B1F]'>(รุ่นที่ {selectedEvent.No})</span>}

                        <div className='flex flex-col mb-1'>
                            <span className='text-sm text-[#0056FF]'>
                                {moment(selectedEvent.startDate).format('LL')}
                                {moment(selectedEvent.startDate).isSame(selectedEvent.endDate, 'day') 
                                    ? '' 
                                    : ` - ${moment(selectedEvent.endDate).format('LL')}`}
                            </span>
                            <span className='text-sm'>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                        </div>
                        
                        {selectedEvent.channel && 
                            <>
                            <span className='text-sm font-bold'>Channel:</span>
                            <span 
                                className={`text-sm font-bold text-white rounded-lg pl-1 pr-1 ${getChannelColor(selectedEvent.channel)}`}>{selectedEvent.channel}
                            </span>
                            </>
                        }
                        {selectedEvent.position && (
                            <>
                                <span className='text-sm ml-2 font-bold'>Position:</span>
                                <span className='text-sm ml-1'> {selectedEvent.position}</span>
                            </>
                        )}
                        <br/>
                        <p className='text-md mb-4'>{selectedEvent.description}</p>
                        
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
                        {user.role === 'admin' && (
                            <div className='flex items-center justify-center w-full mt-5'>
                                <button
                                    className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => router.push(`/checkin/admin?id=${selectedEvent._id}`)}
                                >
                                    Check-In
                                </button>
                            </div>
                        )}
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
