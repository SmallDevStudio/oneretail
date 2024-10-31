import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { AdminLayout } from '@/themes';
import moment from 'moment';
import DatePicker, { registerLocale } from 'react-datepicker';
import th from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
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

registerLocale('th', th);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    No: '',
    type: '',
    position: '',
    place: '',
    mapLocation: '',
    link: '',
    note: '',
    status: '',
    creator: '',
    channel: '',
  });
  const [editId, setEditId] = useState(null);
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
  
  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
      setFilteredEvents(response.data.data); // Initialize filtered events with all events
    };
    fetchEvents();
  }, []);

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

  // Handle Search Input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(value)
    );
    setFilteredEvents(filtered);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/events/${editId}`, form);
    } else {
      const formdata = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        creator: session.user.id,
        status: form.status === '' ? 'true' : 'false',
      }
      console.log('Submitting form data:', formdata);
      try {
        await axios.post('/api/events', formdata);
      } catch (error) {
        console.error('Error submitting form:', error.response ? error.response.data : error.message);
      }
    }
    setForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      No: '',
      type: '',
      position: '',
      place: '',
      mapLocation: '',
      link: '',
      note: '',
      status: '',
      creator: '',
      channel: '',
    });
    setEditId(null);
    const response = await axios.get('/api/events');
    setEvents(response.data.data);
    setFilteredEvents(response.data.data); // Update filtered events after submission
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/events/${id}`);
    const response = await axios.get('/api/events');
    setEvents(response.data.data);
    setFilteredEvents(response.data.data); // Update filtered events after deletion
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      No: event.No,
      type: event.type,
      position: event.position,
      place: event.place,
      mapLocation: event.mapLocation,
      link: event.link,
      note: event.note,
      status: event.status,
      creator: event.creator,
      channel: event.channel,
    });
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
            setUserJoin(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCloseJoin = () => {
        setSelectedJoin(null);
        setOpenJoin(false);
    };

  const columns = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'startDate', headerName: 'Start Date', width: 150, renderCell: (params) => moment(params.value).format('DD/MM/YYYY') },
    { field: 'endDate', headerName: 'End Date', width: 150, renderCell: (params) => moment(params.value).format('DD/MM/YYYY') },
    { field: 'startTime', headerName: 'Start Time', width: 80 },
    { field: 'endTime', headerName: 'End Time', width: 80 },
    { field: 'position', headerName: 'Position', width: 150 },
    { field: 'mapLocation', headerName: 'Map Location', width: 150 },
    { field: 'link', headerName: 'Link', width: 150 },
    { field: 'creator', headerName: 'Creator', width: 80 },
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 ml-2"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleJoinChange = (data) => {
  };

  const handleJoin = async() => {
    const newData = {
      empId: userJoin,
      eventId: selectedJoin._id,
    }

    console.log('newData', newData);
  }

  console.log('selectedJoin', selectedJoin);

  return (
    <React.Fragment>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#0056FF]">จัดการกิจกรรม</h1>
        <div className="mb-2">
          <div className='flex flex-row justify-between items-center mb-2'>
            <button
              className="bg-[#0056FF] text-white px-4 py-2 rounded-md"
              onClick={handleOpen}
            >
              เพิ่มกิจกรรม
            </button>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by Title"
                value={searchQuery}
                onChange={handleSearch}
                className="p-2 border rounded-lg w-full"
              />
            </div>
          </div>
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
        </div>
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
        {open && (
          <Modal
            open={open}
            onClose={handleClose}
           >
            <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg shadow-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-bold">Title:</label>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="p-2 border rounded-xl"
              />
              <label htmlFor="description" className="font-bold">Description:</label>
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="p-2 border rounded-xl"
              />
              <div className="flex flex-row gap-2 w-full items-center">
                <label htmlFor="startDate" className="font-bold">Start Date:</label>
                <DatePicker
                  selected={form.startDate ? new Date(form.startDate) : null}
                  onChange={(date) => setForm({ ...form, startDate: date.toISOString() })}
                  className="p-2 border rounded-xl"
                  placeholderText="Start Date"
                  locale="th"
                  dateFormat="dd/MM/yyyy"
                />
                <label htmlFor="endDate" className="font-bold">End Date:</label>
                <DatePicker
                  selected={form.endDate ? new Date(form.endDate) : null}
                  onChange={(date) => setForm({ ...form, endDate: date.toISOString() })}
                  className="p-2 border rounded-xl"
                  placeholderText="End Date"
                  locale="th"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="flex flex-row gap-2 w-full items-center">
                <label htmlFor="startTime" className="font-bold">Start Time:</label>
                <input
                  type="text"
                  placeholder="Start Time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="p-2 border rounded-xl"
                />
                <label htmlFor="endTime" className="font-bold">End Time:</label>
                <input
                  type="text"
                  placeholder="End Time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="p-2 border rounded-xl"
                />
              </div>
              <div className="flex flex-row gap-2 w-full items-center">
                <label htmlFor="No" className="font-bold">No:</label>
                <input
                  type="text"
                  placeholder="No"
                  value={form.No}
                  onChange={(e) => setForm({ ...form, No: e.target.value })}
                  className="p-2 border rounded-xl"
                />
                <label htmlFor="type" className="font-bold">Type:</label>
                <input
                  type="text"
                  placeholder="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="p-2 border rounded-xl"
                />
                <label htmlFor="position" className="font-bold">Position:</label>
                <input
                  type="text"
                  placeholder="Position"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="p-2 border rounded-xl"
                />
                <label htmlFor="channel" className="font-bold">Channel:</label>
                <input
                  type="text"
                  placeholder="Channel"
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="p-2 border rounded-xl"
                />
              </div>
              <div className="flex flex-row gap-2 w-full items-center">
                <label htmlFor="place" className="font-bold">Place:</label>
                <input
                  type="text"
                  placeholder="Place"
                  value={form.place}
                  onChange={(e) => setForm({ ...form, place: e.target.value })}
                  className="p-2 border rounded-xl"
                />
                <label htmlFor="mapLocation" className="font-bold">Map Location:</label>
                <input
                  type="text"
                  placeholder="Map Location"
                  value={form.mapLocation}
                  onChange={(e) => setForm({ ...form, mapLocation: e.target.value })}
                  className="p-2 border rounded-xl"
                />
                <label htmlFor="link" className="font-bold">Link:</label>
                <input
                  type="text"
                  placeholder="Link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="p-2 border rounded-xl"
                />
              </div>
              <label htmlFor="note" className="font-bold">Note:</label>
              <textarea
                placeholder="Note"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={4}
                className="p-2 border rounded-xl"
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="mt-4 p-2 bg-blue-600 text-white rounded-full font-bold w-1/4">
                {editId ? 'อัพเดท Event' : 'เพิ่ม Event'}
              </button>
            </div>
          </form>
          </Modal>
        )}
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
      </div>
    </React.Fragment>
  );
};

ManageEvents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ManageEvents.auth = true;

export default ManageEvents;
