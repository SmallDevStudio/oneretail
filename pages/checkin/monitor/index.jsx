import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import { IoIosArrowBack } from "react-icons/io";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const MonitorEvent = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isOn, setIsOn] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const { data: checkinData, error: checkinError, mutate: checkinMutate } = useSWR('/api/checkin/monitor', fetcher, 
        {
            refreshInterval: 5000,  // Refresh ข้อมูลทุก 5 วินาที
            revalidateOnFocus: true, // รีเฟรชเมื่อกลับมาที่หน้าเว็บ
            onSuccess: (data) => {
                setEvents(data.data);
            }
        }
    );

    useEffect(() => {
        if (search) {
            const filtered = events.filter(event => event.event.title.toLowerCase().includes(search.toLowerCase()));
            setFilteredEvents(filtered);
        }

        if (isOn) {
            const filtered = events.filter(event => event.adminCheckins.on === true);
            setFilteredEvents(filtered);
        }

        if (!search && !isOn) {
            setFilteredEvents(events);
        }

    }, [events, isOn, search]);

    console.log('events', events);

    return (
        <div className="flex flex-col pb-20 min-h-screen">
            {/* Header */}
            <div className="flex flex-row justify-between items-center p-5 bg-[#0056FF] text-white">
                <IoIosArrowBack className="text-xl inline" />
                <h2 className="text-2xl font-bold">Monitor Events</h2>
                <div></div>
            </div>
            {/* Search */}
            <div className="flex flex-row items-center p-2">
                <input
                    type="text"
                    placeholder="ค้นหาชื่อกิจกรรม"
                    className="w-full border border-gray-400 rounded-full text-sm p-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-row items-center px-2 gap-2 text-sm">
                <input 
                    type="checkbox" 
                    name="on" 
                    id="on" 
                    checked={isOn} 
                    onChange={(e) => setIsOn(e.target.checked)}
                />
                <label htmlFor="on">แสดงเฉพาะกิจกรรมที่เปิด</label>
            </div>
            {/* Content */}
            <div className="flex flex-col w-full mt-1">
                {filteredEvents.map((event, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col text-sm bg-gray-200 mb-2 rounded-md p-2"
                        onClick={() => router.push(`/checkin/monitor/${event?.event?._id}`)}
                    >
                        <div className="flex flex-row justify-between gap-2 w-full">
                            <div>
                                <div
                                    className={`w-2 h-2 rounded-full inline-block mr-2
                                        ${event?.adminCheckins?.on ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="font-bold text-left">{event?.event?.title}</span>
                            </div>
                            <span className="text-xs w-32 text-right">{moment(event.adminCheckins?.createdAt).format('ll')}</span>
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <span>จำนวนผู้เข้าร่วม: <strong className="text-[#0056FF]">{event?.userJoin?.length ? event?.userJoin?.length : 0}</strong></span>
                            <span>จำนวนCheckIn: <strong className="text-[#F68B1F]">{event?.checkin?.length ? event?.checkin?.length : 0}</strong></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonitorEvent;

MonitorEvent.getLayout = (page) => <AppLayout>{page}</AppLayout>;
MonitorEvent.auth = true;