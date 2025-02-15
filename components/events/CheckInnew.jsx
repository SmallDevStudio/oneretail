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
import AddEventCheckin from "./addEventCheckin";
import { IoPeopleOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckIn({events}) {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [openAddEvent, setOpenAddEvent] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [selectedQR, setSelectedQR] = useState(null);
    const [on, setOn] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [point, setPoint] = useState(0);
    const [coins, setCoins] = useState(0);

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
        setOpenAddEvent(false);
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
          </div>
          <Dialog
            fullScreen
            open={openAddEvent}
            onClose={handleCloseEvent}
            TransitionComponent={Transition}
            keepMounted
          >
            <AddEventCheckin 
              onClose={handleCloseEvent}
            />
          </Dialog>
      </div>
    );
};

