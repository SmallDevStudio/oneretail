import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5"
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

export default function CheckInAdmin() {
    const [events, setEvents] = useState([]);
    const [filterEvents, setFilterEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedEventId, setSelectedEventId] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();

    const { data, error, isLoading} = useSWR('/api/events/eventcheckin', fetcher, {
        onSuccess: (data) => {
            setEvents(data.data);
        },
    });

    useEffect(() => {
        if (search) {
            const filteredEvents = events.filter(
                event => event.title.toLowerCase().includes(search.toLowerCase())
            );
            setFilterEvents(filteredEvents);
        } else {
            setFilterEvents(events);
        }
    }, [search, events]);

    const handleSelectEvent = (eventId) => {
        setSelectedEventId(eventId);
        router.push(`/check-in/admin/${eventId}`);
    };

    return (
        <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex flex-row items-center bg-[#0056FF] p-2 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-white"
                    onClick={() => router.back()}
                    size={30}
                />
                <h1 className="text-lg font-bold text-white ml-2">
                    Admin Console - Check-in
                </h1>
            </div>

            {/* Select */}
            <div className="flex flex-col p-2 gap-2 w-full">
                <span className="text-lg font-bold text-[#0056FF]">เลือกกิจกรรม</span>
                <div className="relative mb-2">
                    <input 
                        type="text" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="ค้นหากิจกรรม" 
                        className="w-full p-2 rounded-xl border text-sm" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <IoSearchOutline size={20} className="text-gray-500"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    {filterEvents.map((event, index) => (
                        <div 
                            key={index}
                            className="flex flex-row items-center w-full p-2 rounded-xl bg-gray-200 text-black gap-2 text-sm hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleSelectEvent(event._id)}
                        >
                            <div className={`w-3 h-3 rounded-full ${event.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-2">
                                    <span>{event.title}</span>
                                    <span><strong>รุ่นที่:</strong> {event.No}</span>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <span><strong>วันที่เริ่ม:</strong> {moment(event.startDate).format("ll")}</span>
                                    <span><strong>วันที่สิ้นสุด:</strong> {moment(event.endDate).format("ll")}</span>
                                </div>
                                <span><strong>สถานที่:</strong> {event.location}</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}