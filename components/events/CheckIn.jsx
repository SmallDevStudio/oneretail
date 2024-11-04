import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import 'moment/locale/th';
import Modal from '@/components/Modal';
import { IoQrCodeOutline } from "react-icons/io5";
import { QRCodeCanvas } from 'qrcode.react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { IoPeopleOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckIn({events}) {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [open, setOpen] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [selectedQR, setSelectedQR] = useState(null);
    const [on, setOn] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [point, setPoint] = useState(0);
    const [coins, setCoins] = useState(0);
    const [openJoin, setOpenJoin] = useState(false);
    const [selectedJoin, setSelectedJoin] = useState(null);
    const [userJoin, setUserJoin] = useState([]);
    const [userJoinData, setUserJoinData] = useState([]);

    const { data: session } = useSession();
    const userId = session?.user.id;

    useEffect(() => {
        if (!events) return;
        
        if (searchQuery) {
          const filtered = events.filter(event => 
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredEvents(filtered);
        } else {
          setFilteredEvents(events);
        }
    }, [events, searchQuery]);

    useEffect(() => {
        if (selectedQR) {
          const fetcherAdminEvent = async () => {
            try {
              const res = await axios.get(`/api/checkin/admin?eventId=${selectedQR._id}`);
                if (!res.data.data) {
                  const res = await axios.post('/api/checkin/admin', { eventId: selectedQR._id, userId });
                    setOn(res.data.data.on);
                    setAdminId(res.data.data._id);
                  } else {
                    setOn(res.data.data.on);
                    setAdminId(res.data.data._id);
                    setPoint(res.data.data.point);
                    setCoins(res.data.data.coins);
                        }
              } catch (error) {
                console.log(error);
              }
          }
    
          fetcherAdminEvent();
        }
      }, [selectedQR, userId]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchQuery(value);
    
        const filtered = events.filter(event => 
          event.title.toLowerCase().includes(value)
        );
        setFilteredEvents(filtered);
    };

    const handleCloseQr = () => {
        setOpenQR(false);
        setSelectedQR(null);
        setAdminId(null);
        setPoint(0);
        setCoins(0);
        setOn(false);
      };
    
      const handleQrCode = async(event) => {
        setOpenQR(true);
        setSelectedQR(event);
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
    
        const handleOpenJoin = async (data) => {
            setSelectedJoin(data);
            setOpenJoin(true);
    
            try {
                const res = await axios.get(`/api/events/userJoin?eventId=${data._id}`);
                setUserJoinData(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
    
        const handleCloseJoin = () => {
            setSelectedJoin(null);
            setUserJoinData([]);
            setUserJoin([]);
            setOpenJoin(false);
        };

        const handleJoinChange = (data) => {
        };
      
        const handleJoin = async() => {
          const newData = {
            empId: userJoin,
            eventId: selectedJoin._id,
          }
      
          console.log('newData', newData);
        }

        const columns = [
            { field: 'title', headerName: 'Title', width: 200 },
            { field: 'description', headerName: 'Description', width: 200 },
            { field: 'startDate', headerName: 'Start Date', width: 150, 
                renderCell: (params) => moment(params.value).format('DD/MM/YYYY') 
            },
            { field: 'endDate', headerName: 'End Date', width: 150, 
                renderCell: (params) => moment(params.value).format('DD/MM/YYYY') 
            },
            { field: 'position', headerName: 'Position', width: 150 },
            { 
              field: 'QRcode',
              headerName: 'Qrcode', 
              width: 100 ,
              renderCell: (params) => (
                <>
                  <IoQrCodeOutline 
                    onClick={() => handleQrCode(params.row)}
                    size={30}
                  />
                </>
              ),
            },
            { field: 'join', headerName: 'Join', width: 100 , renderCell: (params) => (
              <>
                <IoPeopleOutline 
                  onClick={() => handleOpenJoin(params.row)}
                  size={30}
                />
              </>
            )},
          ];
    
    return (
        <div>
            <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                rows={filteredEvents}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection={false}
                getRowId={(row) => row._id}
                />
            </div>

            {openQR && (
          <Modal
            open={openQR}
            onClose={handleCloseQr}
            title="QR Code"
            subtitle="แสดง QR Code ของ Event นี้"
          >
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-[#0056FF]">Check In QRCode</h1>
              <div className="flex flex-col items-center p-2 mt-4">
                <div className="flex flex-col bg-gray-300 text-sm w-full p-2.5 rounded-xl gap-1">
                      <div className="inlineitems-center">
                          <span className="text-lg font-bold">{selectedQR.title}</span>
                          {selectedQR.No && <span className='text-sm font-bold text-[#F68B1F]'>(รุ่นที่ {selectedQR.No})</span>}
                      </div>
                      <div className="flex flex-row items-center">
                          <span className='text-sm text-[#0056FF]'>
                              {moment(selectedQR.startDate).format('LL')}
                              {moment(selectedQR.startDate).isSame(selectedQR.endDate, 'day') 
                                  ? '' 
                                  : ` - ${moment(selectedQR.endDate).format('LL')}`}
                          </span>
                          <span className='text-sm ml-2'>{selectedQR.startTime} - {selectedQR.endTime}</span>
                      </div>
                      <div className="flex flex-row items-center">
                          <span className='text-sm font-bold'>Channel:</span>
                          <span className={`text-sm ml-1 text-white rounded-lg pl-1 pr-1 ${getChannelColor(selectedQR.channel)}`}>{selectedQR.channel}</span>
                      </div>
                      <div className="flex flex-row items-center">
                          <span className='text-sm font-bold'>Position:</span>
                          <span className='text-sm ml-1'> {selectedQR.position}</span>
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
                        value={`${window.location.origin}/checkin/${selectedQR._id}`} 
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
          </Modal>
        )}

        <Dialog
          open={openJoin}
          onClose={handleCloseJoin}
          TransitionComponent={Transition}
          fullScreen
        >
          <div className='flex flex-col w-full'>
              <div className='flex flex-row items-center mb-2 p-2 gap-4'>
                <IoIosArrowBack onClick={handleCloseJoin} size={30}/>
                <span className='text-xl font-bold text-[#0056FF]'>จัดการผู้เข้าร่วม</span>
              </div>

              <Divider />

              <div className='flex flex-col w-full p-2'>
                <span className='text-xl font-bold'>{selectedJoin?.title}</span>
                <div className='flex flex-row items-center gap-2'>
                  <span className='font-bold'>ชื่อผู้เข้าร่วม: </span>
                </div>
                
                <div className='flex flex-col gap-2 w-1/2 mt-4 p-2 border-2 rounded-lg'>
                    <label htmlFor="userJoin" className="font-bold">ผู้เข้าร่วม</label>
                    <textarea
                      id="userJoin"
                      value={userJoin}
                      onChange={(e) => handleJoinChange(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      rows={5}
                    />
                    <div>
                      <button
                        className="bg-[#0056FF] text-white px-4 py-2 rounded-md"
                        onClick={handleJoin}
                      >
                        เพิ่มผู้เข้าร่วม
                      </button>
                    </div>
                </div>
              </div>
          </div>
        </Dialog>
        </div>
    );
};

