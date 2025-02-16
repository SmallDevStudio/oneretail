import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchOutline, IoClose } from "react-icons/io5"
import { HiOutlinePhone } from "react-icons/hi";
import Loading from "@/components/Loading";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

export default function AdminCheckInID() {
    const [joinEvents, setJoinEvents] = useState(null);
    const [event, setEvent] = useState(null);
    const [userJoin, setUserJoin] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [filterUsers, setFilterUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { eventId } = router.query;
    const { data: session } = useSession();
    
    const { data, error, isLoading } = useSWR(`/api/check-in/join?eventCheckinId=${eventId}`, fetcher, {
        refreshInterval: 1000,
        onSuccess: (data) => {
            setJoinEvents(data.data);
            setLoading(false);
        }
    });

    const { data: dataEvent, error: errorEvent, isLoading: isLoadingEvent} = useSWR(`/api/check-in/event?id=${eventId}`, fetcher, {
        onSuccess: (data) => {
            setEvent(data.data);
        },
    });

    useEffect(() => {
        if (event) return;
        if (joinEvents) return;
        setLoading(false);
    }, [event, joinEvents]);

    useEffect(() => {
        if (joinEvents && event) {
            const eventUsers = event.users.map(user => {
                const isJoined = joinEvents.some(join => join.user.userId === user.userId);
                return {
                    ...user,
                    status: isJoined
                };
            });
    
            setUserJoin(eventUsers);  // ใช้ users จาก event เป็นหลัก
            setFilterUsers(eventUsers);  // กำหนดค่าเริ่มต้น
        }
    }, [joinEvents, event]);
    
    useEffect(() => {
        let filtered = userJoin;

        // Filter by search
        if (search) {
            filtered = filtered.filter(user =>
                user.fullname.toLowerCase().includes(search.toLowerCase()) ||
                user.empId.includes(search)
            );
        }

        // Filter by status
        if (status === "active") {
            filtered = filtered.filter(user => user.status === true);
        } else if (status === "inactive") {
            filtered = filtered.filter(user => user.status === false);
        }

        setFilterUsers(filtered);

    }, [search, status, userJoin]);

    const handleClearSearch = () => {
        setSearch("");
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    if (error) return <div>Failed to load</div>;
    if (!data || isLoading || isLoadingEvent || !event || loading) return <div><Loading /></div>;

    return (
        <div className="flex flex-col w-full pb-20">
            {/* Header */}
            <div className="flex flex-row items-center bg-[#0056FF] p-2 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-white"
                    onClick={() => router.back()}
                    size={30}
                />
                <h1 className="text-lg font-bold text-white ml-2">
                    {event?.title}
                </h1>
            </div>

            {/* body */}
            <div className="flex flex-col p-2 w-full">
                {/* event */}
                <div className="flex flex-col bg-gray-200 rounded-xl border shadow-md w-full">
                    <div className="flex flex-col p-2 w-full">
                        <div className="flex flex-row gap-2">
                            <span>{event?.title}</span>
                            <span><strong>รุ่นที่:</strong> {event?.No}</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <span><strong>วันที่เริ่ม:</strong> {moment(event?.startDate).format("ll")}</span>
                            <span><strong>วันที่สิ้นสุด:</strong> {moment(event?.endDate).format("ll")}</span>
                        </div>
                        <span><strong>สถานที่:</strong> {event?.location}</span>
                    </div>
                </div>

                {/* Deshboard */}
                <div className="flex flex-col mt-2 p-2 w-full">
                    {/* Search */}
                    <div className="flex flex-col gap-1 w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <IoSearchOutline className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="search"
                                id="search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ค้นหา"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={handleClearSearch}>
                                    <IoClose className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row gap-2">
                            <select
                                id="active"
                                className="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="active">กําลังเข้าร่วม</option>
                                <option value="inactive">ไม่กําลังเข้าร่วม</option>
                            </select>
                        </div>
                    </div>
                    {/* Monitor */}
                    <div className="flex flex-row w-full gap-2 mt-4">
                        <div className="flex flex-col items-center justify-center bg-gray-200 rounded-xl h-[120px] w-1/2 p-2">
                            <span className="font-bold text-[3em] text-[#F2871F]">{joinEvents?.length}</span>
                            <span className="font-bold">กําลังเข้าร่วม</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-gray-200 rounded-xl h-[120px] w-1/2 p-2">
                            <span className="font-bold text-[3em] text-[#0056FF]">{event?.users.length}</span>
                            <span className="font-bold">ผู้เข้าร่วมทั้งหมด</span>
                        </div>
                    </div>
                    {/* users */}
                    <div className="flex flex-col mt-2 w-full">
                        <span className="font-bold">ผู้เข้าร่วม</span>
                        {filterUsers.map((user, index) => (
                            <div 
                                key={index}
                                className="flex flex-row items-center gap-2 px-4 py-1 justify-between bg-gray-200 rounded-3xl mt-2"
                            >
                                <div className="flex flex-row items-center gap-2 text-xs">
                                <div className={`w-4 h-4 ${user.status ? "bg-[#0056FF] p-2 rounded-full" : "bg-red-500 p-2 rounded-full"}`}></div>
                                    <div className="w-10 h-10">
                                        <Image
                                            src={user.pictureUrl}
                                            alt={user.fullname}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                
                                    <div className="flex flex-col text-[#0056FF] font-bold">
                                        <span> {user.empId} </span>
                                        <span>{user.fullname}</span>
                                    </div>
                                    
                                </div>
                                <div className="flex text-sm flex-row bg-[#F2871F] px-2 py-1 rounded-full text-white items-center gap-2"
                                    onClick={() => handleCall(user.phone)}
                                >
                                    <div className="bg-white p-1 rounded-full text-[#F2871F]"><HiOutlinePhone size={15}/></div>
                                    <span className="font-bold">{user.phone}</span>
                                </div>
                            </div>
                        ))} 
                    </div>
                </div>

            </div>
        </div>
    );
}