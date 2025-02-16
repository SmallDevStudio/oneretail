import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import moment from 'moment';
import 'moment/locale/th';
import Modal from '@/components/Modal';
import { QRCodeCanvas } from 'qrcode.react';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, Slide, Divider, Switch, Tooltip } from '@mui/material';
import AddEventCheckin from "./addEventCheckin";
import { IoPeopleOutline, IoQrCodeOutline, IoClose } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import Report from "./Report";
import { toast } from "react-toastify";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = url => axios.get(url).then(res => res.data);

export default function CheckIn() {
    const [events, setEvents] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [openAddEvent, setOpenAddEvent] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openQrCode, setOpenQrCode] = useState(false);
    const [qrCodeLink, setQrCodeLink] = useState('');

    const { data: session } = useSession();
    const userId = session?.user.id;
    const router = useRouter();

    const { data, error, mutate, isLoading} = useSWR('/api/events/eventcheckin', fetcher, {
        onSuccess: (data) => {
            setEvents(data.data);
        },
    });

    console.log('selectedEvent:', selectedEvent);

    useEffect(() => {
        if (!events) return;
        
        if (searchQuery) {
          const filtered = events.filter(event => 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event?.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event?.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event?.position.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredEvents(filtered);
        } else {
          setFilteredEvents(events);
        }
    }, [events, searchQuery]);

    
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchQuery(value);
    
        const filtered = events.filter(event => 
          event.title.toLowerCase().includes(value)
        );
        setFilteredEvents(filtered);
    };

    const handleOpenEvent = () => {
        setOpenAddEvent(true);
    };

    const handleCloseEvent = () => {
        setSelectedEvent(null);
        setOpenAddEvent(false);
    };

    const handleOpenReport = (event) => {
        setSelectedEvent(event);
        setOpenReport(true);
    };

    const handleCloseReport = () => {
        setSelectedEvent(null);
        setOpenReport(false);
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setOpenAddEvent(true);
    };


    const handleCloseQrCode = () => {
        setSelectedEvent(null);
        setOpenQrCode(false);
    };
    
    const handleQrCode = async(event) => {
        const generateQrCodeUrl = process.env.NEXT_PUBLIC_BASE_URL + `/check-in?id=${event._id}`;
        setSelectedEvent(event);
        setQrCodeLink(generateQrCodeUrl);
        setOpenQrCode(true);
    };
    
    const handleDownloadQrCode = () => {
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

    if (error) return <div>failed to load</div>;

    const handleDeleteEvent = async (eventCheckinId) => {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการลบ Event Check-in นี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบ!',
        cancelButtonText: 'ยกเลิก'
      })

      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/events/eventcheckin/${eventCheckinId}`);
          Swal.fire({
            icon: 'success',
            title: 'ลบสําเร็จ',
            text: 'ลบ Event Check-in สําเร็จ',
            confirmButtonText: 'ตกลง',
          });
          mutate();
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'ลบไม่สําเร็จ',
            text: 'ลบ Event Check-in ไม่สําเร็จ',
            confirmButtonText: 'ตกลง',
          });
        }
      }
    }

    const handleActiveToggle = async (id, value) => {
      try {
        await axios.put(`/api/events/eventcheckin/${id}`, { active: !value });
        mutate();
        toast.success('Updated successfully');
      } catch (error) {
        console.log(error);
      }
    };

    const handleClipboardCopy = (link) => {
      navigator.clipboard.writeText(link);
      toast.success('Copied to clipboard');
    }

    const columns = [
      { field: 'title', headerName: 'ชื่อกิจกรรม', width: 400 },
      { field: 'No', headerName: 'รุ่น', width: 100 },
      { field: 'startDate', headerName: 'วันเริ่ม', width: 150, 
        renderCell: (params) => moment(params.value).format('DD/MM/YYYY') 
      },
      { field: 'endDate', headerName: 'วันสิ้นสุด', width: 150, 
        renderCell: (params) => moment(params.value).format('DD/MM/YYYY') 
      },
      { field: 'channel', headerName: 'Channel', width: 100 },
      { field: 'position', headerName: 'Position', width: 100 },
      { field: 'active', headerName: 'สถานะ', width: 100,
        renderCell: (params) => (
          <div className={`flex flex-col items-center justify-center w-full`}>
            <button
              className={`flex  h-10 w-24 items-center justify-center rounded-lg ${params.value ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'} font-bold`}
              onClick={() => handleActiveToggle(params.row._id, params.value)}
            >
              {params.value ? 'เปิด' : 'ปิด'}
            </button>
          </div>
        )
       },
      { field: 'users', headerName: 'จำนวนผู้เข้าร่วม', width: 100,
        renderCell: (params) => (
          <div className="flex flex-row items-center justify-center">
            <p>{params.value.length}</p>
          </div>
        )
      },
      { field: 'remark', headerName: 'หมายเหตุ', width: 200 },
      { field: 'action', headerName: 'เครื่องมือ', width: 200,
        renderCell: (params) => (
          <div className="flex flex-row items-center justify-center gap-4 mt-2">
              <FaEdit 
                size={30} 
                className="text-[#0056FF] cursor-pointer"
                onClick={() => handleEditEvent(params.row)}
              />
              <TbReportAnalytics 
                size={32}
                className="text-green-500 cursor-pointer"
                onClick={() => handleOpenReport(params.row)}
              />
              <IoQrCodeOutline 
                size={30} 
                className="text-[#0056FF] cursor-pointer"
                onClick={() => handleQrCode(params.row)}
              />
              <RiDeleteBinLine 
                size={30} 
                className="text-red-500 cursor-pointer"
                onClick={() => handleDeleteEvent(params.row._id)}
              />
          </div>
        ),
      },

    ]
    
    return (
      <div className="flex flex-col p-2 w-full">
          {/* Header */}
          <div className="flex flex-row justify-between items-center w-full">
            <button
              className="text-sm bg-[#0056FF] text-white font-bold py-2 px-4 rounded-xl"
              onClick={handleOpenEvent}
            >
              เพิ่มกิจกรรม
            </button>
            <div>
              <input
                className="border border-gray-300 rounded-md p-2"
                type="text"
                placeholder="ค้นหากิจกรรม"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-col mt-4">
            <div className="h-96 w-full">
              <DataGrid
                rows={filteredEvents}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row._id}
                disableSelectionOnClick
              />
            </div>
          </div>
          {/* Form */}
          <Dialog
            fullScreen
            open={openAddEvent}
            onClose={handleCloseEvent}
            TransitionComponent={Transition}
            keepMounted
          >
            <AddEventCheckin 
              onClose={handleCloseEvent}
              mutate={mutate}
              selectedEventData={selectedEvent}
            />
          </Dialog>

          {/* QR Code */}
          <Dialog
            open={openQrCode}
            onClose={handleCloseQrCode}
            TransitionComponent={Transition}
            keepMounted
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-row bg-[#0056FF] items-center gap-4 mb-4 w-full p-2">
                <IoIosArrowBack 
                  size={30} 
                  className="text-white cursor-pointer"
                  onClick={handleCloseQrCode}
                />
                <span className="text-white font-bold text-lg">QR Code: Check-In</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="flex flex-row items-center justify-center">
                  <QRCodeCanvas 
                    id="qr-code-download"
                    value={qrCodeLink}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <span className="text-black font-bold text-sm">คลิกเพื่อคัดลอก</span>
                  <span 
                    className="text-[#0056FF] font-bold mb-4 text-sm cursor-pointer"
                    onClick={() => handleClipboardCopy(qrCodeLink)}
                  >
                    {qrCodeLink}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <button
                    className="text-sm bg-[#0056FF] text-white font-bold py-2 px-4 rounded-xl"
                    onClick={handleDownloadQrCode}
                  >
                    ดาวน์โหลด
                  </button>
                </div>
              </div>
            </div>
          </Dialog>

          {/* Report */}
          <Dialog
            fullScreen
            open={openReport}
            onClose={handleCloseReport}
            TransitionComponent={Transition}
            keepMounted
          >
            <Report 
              event={selectedEvent}
              onClose={handleCloseReport}
              mutate={mutate}
            />
          </Dialog>

      </div>
    );
};

