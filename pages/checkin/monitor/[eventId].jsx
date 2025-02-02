import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AppLayout } from "@/themes";
import { IoIosArrowBack } from "react-icons/io";
import moment from "moment";
import "moment/locale/th";
import Avatar from "@/components/utils/Avatar";
import { IoQrCodeSharp } from "react-icons/io5";
import { Slide, Dialog } from "@mui/material";
import { QRCodeCanvas } from 'qrcode.react';
import { IoCloseCircle } from "react-icons/io5";
import Swal from "sweetalert2";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MonitorEvent = () => {
    const [events, setEvents] = useState({});
    const [filterUser, setFilterUser] = useState([]);
    const [on, setOn] = useState(false);
    const [search, setSearch] = useState('');
    const [checkin, setCheckin] = useState(false);
    const [unCheckin, setUnCheckin] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();
    const { eventId } = router.query;

    const { data: checkinData, error: checkinError, mutate: checkinMutate } = useSWR(
        `/api/checkin/monitor/${eventId}`,
        fetcher,
        {
            refreshInterval: 5000,  // Refresh ข้อมูลทุก 5 วินาที
            revalidateOnFocus: true, // รีเฟรชเมื่อกลับมาที่หน้าเว็บ
            onSuccess: (data) => {
                setEvents(data.data);
            }
        }
    );

    useEffect(() => {
        if (!events?.userJoin) return;

        // เช็คสถานะว่าผู้ใช้คนนี้มี `checkin` หรือไม่ และดึง `createdAt`
        const userCheckinMap = new Map(
            events?.checkin?.map(user => [user.user.userId, user.createdAt])
        );

        let filtered = events?.userJoin.map(user => ({
            ...user,
            hasCheckin: userCheckinMap.has(user.userId),
            checkinTime: userCheckinMap.get(user.userId) || null
        }));

        // Apply Filters
        if (checkin && !unCheckin) {
            filtered = filtered.filter(user => user.hasCheckin);
        } else if (!checkin && unCheckin) {
            filtered = filtered.filter(user => !user.hasCheckin);
        } 

        // Apply Search
        if (search) {
            filtered = filtered.filter(
                user => user.fullname.toLowerCase().includes(search.toLowerCase()) ||
                    user.empId.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort by checkin.createdAt (ล่าสุดไปเก่าสุด)
        filtered.sort((a, b) => {
            if (a.checkinTime && b.checkinTime) {
                return new Date(b.checkinTime) - new Date(a.checkinTime);
            }
            return a.checkinTime ? -1 : 1; // คนที่ checkin มาก่อน
        });

        setFilterUser(filtered);
    }, [events, search, checkin, unCheckin]);

    useEffect(() => {
        if (events?.adminCheckin?.on) {
            setOn(true);
        } else {
            setOn(false);
        }

    }, [events?.adminCheckin?.on]);

    const handleUpdateOn = async (adminId) => {
        setOn(!on);
        try {
            await axios.put(`/api/checkin/admin?id=${adminId}`, { 
                userId, 
                on: !on 
            });
            checkinMutate();
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpen = (eventId) => {
        setSelectedEvent(eventId);
        setOpen(true);
    }

    const handleClose = () => {
        setSelectedEvent(null);
        setOpen(false);
    }

    const handleDownload = () => {
        const canvas = document.getElementById("qr-code-download");
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl
            downloadLink.download = `OneRetail-CheckIn.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const handlePhone = (phone) => {
        Swal.fire({
            title: "โทรออก?",
            text: `คุณต้องการโทรไปที่ ${phone} หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "โทรออก",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `tel:${phone}`;
            }
        });
    };

    return (
        <div className="flex flex-col bg-gray-200 pb-20 min-h-screen">
            {/* Header */}
            <div className="flex flex-row justify-between items-center p-5 bg-[#0056FF] text-white">
                <IoIosArrowBack className="text-xl inline" onClick={() => router.back()} />
                <h2 className="text-2xl font-bold">Monitor Events</h2>
                <div></div>
            </div>

            {/* Content */}
            <div className="flex flex-col w-full mt-1 gap-2">
                {/* Event Details */}
                <div className="flex flex-col bg-white text-sm p-2 w-full">
                    <div className="flex flex-row items-center gap-2">
                        <span className="font-bold">{events?.event?.title}</span>
                        {events?.event?.No && (
                            <div className="flex flex-row items-center gap-1">
                                <span>รุ่นที่</span>
                                <span className="font-bold">{events?.event?.No}</span>
                            </div>
                        )}
                    </div>
                    <span className="font-light">{events?.event?.description}</span>
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center">
                            <span className="font-bold">วันที่:</span>
                            <span className="font-light ml-1">{moment(events?.event?.startDate).format('DD MMM YYYY')}</span>
                            <span className="font-light ml-1">-</span>
                            <span className="font-light ml-1">{moment(events?.event?.endDate).format('DD MMM YYYY')}</span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-6 mt-1">
                        <div
                            className={`flex items-center justify-end self-end rounded-full text-white px-4 py-1 font-bold
                                ${events?.adminCheckin?.on ? 'bg-green-600' : 'bg-red-600'}    
                            `}
                            onClick={() => handleUpdateOn(events?.adminCheckin?.id)}
                        >
                            <span>{events?.adminCheckin?.on ? 'เปิด' : 'ปิด'}</span>   
                        </div>
                        {events?.adminCheckin?.on && (
                            <IoQrCodeSharp size={30} onClick={() => handleOpen(events?.event?._id)}/>
                        )}
                    </div>
                </div>

                {/* Check-in Summary */}
                <div className="flex flex-row text-sm w-full gap-1">
                    <div className="flex flex-col items-center justify-center h-[200px] w-1/2 bg-green-600 text-white gap-6">
                        <span className="font-bold">Check-In</span>
                        <span className="font-bold text-[5em]">{events?.checkin?.length || 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center h-[200px] w-1/2 bg-blue-600 text-white gap-6">
                        <span className="font-bold">รายชื่อผู้เข้าร่วม</span>
                        <span className="font-bold text-[5em]">{events?.userJoin?.length || 0}</span>
                    </div>
                </div>

                {/* User List */}
                <div className="flex flex-col bg-white gap-2 w-full h-full text-sm overflow-y-auto p-2">
                    {/* Search Box */}
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อหรือ empId"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-full"
                    />

                    {/* Check-in Filters */}
                    <div className="flex flex-row justify-between items-center gap-4 px-2">
                        <label className="flex flex-row items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={checkin} 
                                onChange={() => setCheckin(!checkin)} 
                            />
                            <span className="font-bold">Check-In</span>
                        </label>

                        <label className="flex flex-row items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={unCheckin} 
                                onChange={() => setUnCheckin(!unCheckin)} 
                            />
                            <span className="font-bold">ไม่ได้ Check-In</span>
                        </label>

                        <span className="font-bold text-xs">จํานวน: {filterUser?.length} คน</span>
                    </div>

                    {/* User List (Sorted by Check-in Time) */}
                    {filterUser.map((user, index) => (
                        <div key={index} className="flex flex-row items-center justify-between text-sm px-2 py-1 gap-2">
                            <div className="flex flex-row items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${user.hasCheckin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <Avatar src={user?.pictureUrl} size={30} userId={user?.userId} />
                                <div className="flex flex-col">
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="font-bold">{user?.empId}</span>
                                        <span className="font-bold">{user?.fullname}</span>
                                    </div>
                                    <span 
                                        className="text-sm font-bold text-[#F2871F]"
                                        onClick={() => handlePhone(user?.phone)}
                                    >
                                        {user?.phone}
                                    </span>
                                </div>
                            </div>
                            {user.checkinTime && (
                                <span className="text-gray-500 text-xs">
                                    {moment(user.checkinTime).format("DD MMM YYYY HH:mm:ss")}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="flex flex-col items-center p-2 pb-6 w-full">
                    <IoCloseCircle 
                        size={30}
                        onClick={handleClose}
                        className='absolute top-2 text-[#F2871F] right-2 cursor-pointer'
                    />
                    <QRCodeCanvas 
                        id="qr-code-download"
                        value={`${window.location.origin}/checkin/${selectedEvent}`} 
                        size={220}
                        bgColor={'#fff'}
                        fgColor={'#0056FF'}
                        level={'L'}
                        includeMargin={true}
                        imageQuality={1}
                        style={{ width: '100%', height: 'auto' }}
                        renderAs={'canvas'}
                    />
                    <p className='mb-2 font-bold text-[#0056FF]'>
                        OneRetial Check-In
                    </p>
                    <div>
                        <button
                            className='bg-[#F2871F] text-white font-bold py-1.5 px-4 rounded-full mt-2'
                            onClick={handleDownload}
                            style={{ width: '150px' }}
                        >
                            Download
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default MonitorEvent;

MonitorEvent.getLayout = (page) => <AppLayout>{page}</AppLayout>;
MonitorEvent.auth = true;
