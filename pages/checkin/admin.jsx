import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import { AppLayout } from "@/themes";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "@/components/Loading";
import Divider from '@mui/material/Divider';
import { QRCodeCanvas } from 'qrcode.react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Swal from "sweetalert2";

moment.locale('th');

const fetcher = url => axios.get(url).then(res => res.data);

const AdminCheckIn = () => {
    const [event, setEvent] = useState({});
    const [on, setOn] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [loading, setLoading] = useState(true);
    const [point, setPoint] = useState(0);
    const [coins, setCoins] = useState(0);

    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const userId = session?.user?.id;

    useEffect(() => {
        setLoading(true);
       if (id && userId) {
           const fetcherAdminEvent = async () => {
             try {
                const resEvent = await axios.get(`/api/events/${id}`);
                setEvent(resEvent.data.data);

                const res = await axios.get(`/api/checkin/admin?eventId=${id}`);
                if (!res.data.data) {
                    const res = await axios.post('/api/checkin/admin', { eventId: id, userId });
                    setOn(res.data.data.on);
                    setAdminId(res.data.data._id);
                } else {
                    setOn(res.data.data.on);
                    setAdminId(res.data.data._id);
                    setPoint(res.data.data.point);
                    setCoins(res.data.data.coins);
                }

             } catch (error) {
               setLoading(false);
             } finally {
               setLoading(false);
             }
           };
           fetcherAdminEvent();
       }
    }, [id, userId]);

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

    const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
      ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#65C466',
              opacity: 1,
              border: 0,
              ...theme.applyStyles('dark', {
                backgroundColor: '#2ECA45',
              }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[600],
            }),
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
              opacity: 0.3,
            }),
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: '#E9E9EA',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
          ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
          }),
        },
      }));

      const handleSwitchChange = async() => {
        setOn(!on);

        try {
            await axios.put(`/api/checkin/admin?id=${adminId}`, { 
                userId, 
                on: !on 
            });
        } catch (error) {
            console.log(error);
        }
      };

      const handleUpdate = async() => {
        try {
            await axios.put(`/api/checkin/admin?id=${adminId}`, { 
                point,
                coins 
            });
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสําเร็จ',
                text: 'อัพเดทคะแนนและเหรียญสําเร็จ',
                confirmButtonText: 'ตกลง',
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'บันทึกไม่สําเร็จ',
                text: 'อัพเดทคะแนนและเหรียญไม่สําเร็จ',
                confirmButtonText: 'ตกลง',
            });
        }
      };

      if (loading) return <Loading />;

    return (
        <div>
            <div className="flex flex-row items-center gap-2 mt-2 w-full">
                <IoIosArrowBack
                    className="text-xl inline text-gray-700"
                    onClick={() => router.back()}
                    size={25}
                />
                <h1 className="text-2xl font-bold text-[#0056FF]">Check In</h1>
            </div>

            <Divider className="mt-2"/>

            <div className="flex flex-col items-center p-2 mt-4"> 
                <div className="flex flex-col bg-gray-300 text-sm w-full p-2.5 rounded-xl gap-1">
                    <div className="inlineitems-center">
                        <span className="text-lg font-bold">{event.title}</span>
                        {event.No && <span className='text-sm font-bold text-[#F68B1F]'>(รุ่นที่ {event.No})</span>}
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

                <div className="flex flex-row justify-center items-center mt-2 w-full gap-2">
                    <div className="flex flex-row items-center justify-between bg-gray-300 text-sm w-full p-2.5 rounded-xl gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <label htmlFor="point" className="text-sm font-bold">Point:</label>
                            <input
                                type="number"
                                id="point"
                                value={point}
                                onChange={(e) => setPoint(e.target.value)}
                                className="w-20 text-center rounded-lg p-1"
                            />
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <label htmlFor="coins" className="text-sm font-bold">Coins:</label>
                            <input
                                type="number"
                                id="coins"
                                value={coins}
                                onChange={(e) => setCoins(e.target.value)}
                                className="w-20 text-center rounded-lg p-1"
                            />
                        </div>
                        
                        <div>
                            <button
                                className="bg-[#F68B1F] text-white font-bold py-1 px-2 rounded-full"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </div>
                        
                    </div>
                </div>

                <div className="flex flex-row justify-center items-center mt-5 w-full gap-2">
                    <span className="text-sm font-bold">เปิด/ปิดการใช้งาน:</span>
                    <IOSSwitch 
                        checked={on}
                        onChange={handleSwitchChange}
                    />
                </div>

                {on && (
                    <div className="flex flex-col items-center mt-2 w-full">
                    <QRCodeCanvas 
                        id="qr-code-download"
                        value={`${window.location.origin}/checkin/${id}`} 
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
                )}
            </div>
        </div>
    );
};

export default AdminCheckIn;
