import { useState, useEffect, use } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { AppLayout } from "@/themes";
import Loading from "@/components/Loading";
import Divider from '@mui/material/Divider';
import Modal from "@/components/Modal";
import Swal from "sweetalert2";
import { RiErrorWarningLine } from "react-icons/ri";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const CheckIn = () => {
    const [event, setEvent] = useState({});
    const [adminEvent, setAdminEvent] = useState({});
    const [isOff, setIsOff] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasCheckIn, setHasCheckIn] = useState(false);
    const [hasUserJoin, setHasUserJoin] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const userId = session?.user?.id;

    useEffect(() => {
        if (status === "loading") return; // ยังโหลดข้อมูลอยู่
        if (userId) {
            setLoading(true);
            const fetchCheckIn = async () => {
                try {
                    const res = await axios.get(`/api/checkin/${userId}?eventId=${id}`);
                    if (res.data.data.length > 0) {
                      setHasCheckIn(true);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCheckIn();
            }
    }, [id, router, status, userId]);

    useEffect(() => {
        if (id && userId) {
            setLoading(true);
            const fetcherAdminEvent = async () => {
                try {
                    const res = await axios.get(`/api/checkin/admin?eventId=${id}`);
                    if (!res.data.data.on) {
                        setIsOff(true);
                    } 

                    setAdminEvent(res.data.data);
                    const userJoinRes = await axios.get(`/api/events/userJoin?eventId=${id}`);
                    const userJoin = userJoinRes.data.data;

                    // ตรวจสอบว่ามี empDetails และ userId ตรงกันหรือไม่
                    if (userJoin && userJoin.empDetails) {
                        const hasUser = userJoin.empDetails.some((emp) => emp.userId === userId);
                        setHasUserJoin(hasUser);
                    }
                    
                    const resEvent = await axios.get(`/api/events/${id}`);
                    setEvent(resEvent.data.data);

                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            };
        fetcherAdminEvent();
        }
    }, [id, userId]);

    if (loading) return <Loading />;

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

    const handleClose = () => {
        setIsOff(false);
        router.push('/');
    };

    const handleHasCheckInClose = () => {
        setHasCheckIn(false);
        router.push('/');
    };

    const handleHasUserJoinClose = () => {
        setHasUserJoin(false);
        router.push('/');
    };

    const handleCheckIn = async () => {
        try {
            const res = await axios.post(`/api/checkin`, { 
                eventId: id,
                userId 
            });

            if (adminEvent.point > 0 ) {
                await axios.post('/api/points/point', {
                    userId,
                    description: `เข้าร่วมกิจกรรม ${event.title}`,
                    contentId: id,
                    path: 'events',
                    subpath: 'checkin',
                    type: 'earn',
                    points: adminEvent.point
                });
            }

            if (adminEvent.coins > 0 ) {
                await axios.post('/api/coins/coins', {
                    userId,
                    description: `เข้าร่วมกิจกรรม ${event.title}`,
                    referId: id,
                    path: 'events',
                    subpath: 'checkin',
                    type: 'earn',
                    coins: adminEvent.coins
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'เข้าร่วมกิจกรรมสําเร็จ',
                showConfirmButton: true,
                timer: 1500
            });
            router.push('/');

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'เข้าร่วมกิจกรรมไม่สําเร็จ',
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-2xl font-bold text-[#0056FF] mt-5">CHECK IN</h1>
            <Divider className="w-full mt-2"/>
            <div className="flex flex-col items-center p-2 mt-4 w-full"> 
                <div className="flex flex-col bg-gray-300 text-sm w-full p-2.5 rounded-xl gap-1">
                    <div className="flex flex-row items-center">
                        <span className="text-lg font-bold">{event.title}</span>
                        {event.No && <span className='text-sm font-bold text-[#F68B1F] ml-2 '>(รุ่นที่ {event.No})</span>}
                    </div>
                    <div className="flex flex-row items-center">
                        <span className='text-sm text-[#0056FF]'>
                            {moment(event.startDate).format('LL')}
                            {moment(event.startDate).isSame(event.endDate, 'day') 
                                ? '' 
                                : ` - ${moment(event.endDate).format('LL')}`}
                        </span>
                        <span className='text-sm ml-2'>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <span className='text-sm font-bold'>Channel:</span>
                        <span className={`text-sm ml-1 text-white rounded-lg pl-1 pr-1 ${getChannelColor(event.channel)}`}>{event.channel}</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <span className='text-sm font-bold'>Position:</span>
                        <span className='text-sm ml-1'> {event.position}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center p-2 mt-4 w-full">
                <button
                    className="text-white bg-[#0056FF] w-full p-2.5 rounded-lg"
                    onClick={handleCheckIn}
                    disabled={isOff || hasCheckIn || !hasUserJoin}
                >
                    Check-In
                </button>
            </div>

            {isOff && (
                <Modal
                    open={isOff}
                    onClose={handleClose}
                    title="หมดเวลา"
                    description="หมดเวลาจากการเข้าร่วมกิจกรรม"
                >
                    <div className="flex flex-col items-center p-2 mt-4 w-full">
                        <RiErrorWarningLine 
                            size={80} 
                            className="text-red-500 mb-4"
                        />
                        <p className="text-md font-bold">หมดเวลาจากการเข้าร่วมกิจกรรม</p>
                        <div className="flex flex-col text-sm items-center p-2 w-full">
                            <p>กรุณาติดต่อผู้ดูแลระบบ</p>
                            <p>หรือ</p>
                            <p>ติดต่อเจ้าหน้าที่</p>
                        </div>

                        <button
                            className="text-white bg-[#0056FF] w-full p-2.5 rounded-lg mt-4"
                            onClick={handleClose}
                        >
                            ตกลง
                        </button>
                    </div>
                </Modal>
            )}

            {hasCheckIn && (
                <Modal
                    open={hasCheckIn}
                    onClose={handleHasCheckInClose}
                    title="เข้าร่วมกิจกรรม"
                    description="คุณได้เข้าร่วมกิจกรรมแล้ว"
                >
                    <div className="flex flex-col items-center p-2 mt-4 w-full">
                        <RiErrorWarningLine 
                            size={80} 
                            className="text-red-500 mb-4"
                        />
                        <p className="text-md font-bold">คุณได้เข้าร่วมกิจกรรมแล้ว</p>
                        <div className="flex flex-col text-sm items-center p-2 w-full">
                            <p>กรุณาติดต่อผู้ดูแลระบบ</p>
                            <p>หรือ</p>
                            <p>ติดต่อเจ้าหน้าที่</p>
                        </div>

                        <button
                            className="text-white bg-[#0056FF] w-full p-2.5 rounded-lg mt-4"
                            onClick={handleHasCheckInClose}
                        >
                            ตกลง
                        </button>
                    </div>
                </Modal>
            )}

            {!hasUserJoin && (
                <Modal
                    open={hasUserJoin}
                    onClose={handleHasUserJoinClose}
                    title="เข้าร่วมกิจกรรม"
                    description="คุณได้เข้าร่วมกิจกรรมแล้ว"
                >
                    <div className="flex flex-col items-center p-2 mt-4 w-full">
                        <RiErrorWarningLine 
                            size={80} 
                            className="text-red-500 mb-4"
                        />
                        <p className="text-md font-bold">คุณได้ไม่มีสิทธิ์เข้าร่วมกิจกรรม</p>
                        <div className="flex flex-col text-sm items-center p-2 w-full">
                            <p>กรุณาติดต่อผู้ดูแลระบบ</p>
                            <p>หรือ</p>
                            <p>ติดต่อเจ้าหน้าที่</p>
                        </div>

                        <button
                            className="text-white bg-[#0056FF] w-full p-2.5 rounded-lg mt-4"
                            onClick={handleHasUserJoinClose}
                        >
                            ตกลง
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CheckIn;
