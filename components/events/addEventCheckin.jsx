import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import DatePicker from "react-datepicker";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { FaCalendarAlt, FaClock, FaUserPlus } from 'react-icons/fa';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function AddEventCheckin({ onClose }) {
    const [events, setEvents] = useState([]);
    const [filterEvents, setFilterEvents] = useState([]);
    const [searchEvent, setSearchEvent] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [users, setUsers] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [form, setForm] = useState({
        eventId: '',
        title: '',
        description: '',
        No: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        place: '',
        channel: '',
        position: '',
        active: true
    });
    const [checkField, setCheckField] = useState(true);

    const { data, error, isLoading } = useSWR("/api/events", fetcher,{
        onSuccess: (data) => {
            setEvents(data.data);
        }
    });

    const { data: userData, isLoading: userLoading } = useSWR("/api/users", fetcher, {
        onSuccess: (data) => {
            setUsers(data.users);
        }
    });


    useEffect(() => {
        if (searchEvent) {
            const filteredEvents = events.filter((event) =>
                event?.title?.toLowerCase().includes(searchEvent.toLowerCase())
            );
            setFilterEvents(filteredEvents);
        } else {
            setFilterEvents([]);
        }
    }, [searchEvent, events]);

    useEffect(() => {
        if (selectedEvent) {
            setForm({
                eventId: selectedEvent._id,
                title: selectedEvent.title,
                description: selectedEvent.description,
                No: selectedEvent.No,
                startDate: selectedEvent.startDate,
                endDate: selectedEvent.endDate,
                startTime: selectedEvent.startTime,
                endTime: selectedEvent.endTime,
                place: selectedEvent.place,
                channel: selectedEvent.channel,
                position: selectedEvent.position,
                active: true
            });
        }
    }, [selectedEvent]);

    useEffect(() => {
        if (form.title !== '' && selectedUsers.length > 0) {
            setCheckField(true);
        } else {
            setCheckField(false);
        }
    }, [form.title, selectedUsers.length])

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSearchEvent('');
        setFilterEvents([]);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const ids = inputValue.split(',').map(id => id.trim()).filter(id => id);
          const validIds = ids.filter(id => users.some(user => user.empId === id)); // ตรวจสอบ empId ที่มีใน users
          const newTags = validIds.filter(id => !taggedUsers.includes(id));
          setTaggedUsers([...taggedUsers, ...newTags]);
          setInputValue('');
        }
    };

    const handleTagClick = (user) => {
        if (!taggedUsers.includes(user.empId)) {
          setTaggedUsers([...taggedUsers, user.empId]);
        }
        setInputValue('');
    };

    const handleRemoveUser = (index) => {
        setTaggedUsers(taggedUsers.filter((_, i) => i !== index));
    };

    // ปรับ handleAddUsers ให้ตรวจสอบ empId ซ้ำก่อนเพิ่ม

    const handleAddUsers = () => {
        const selected = taggedUsers
        .filter(empId => !selectedUsers.some(user => user.empId === empId)) // ตรวจสอบว่า empId ไม่มีใน selectedUsers
        .map(empId => {
            const user = users.find(u => u.empId === empId);
            return user ? { empId: user.empId, fullname: user.fullname } : null;
        })
        .filter(u => u !== null);
    
        setSelectedUsers([...selectedUsers, ...selected]);
        setTaggedUsers([]);
    };

    const handleJoinRemove = (index) => {
        setSelectedUsers(selectedUsers.filter((_, i) => i !== index));
    };

    const handleClear = () => {
        setSearchEvent(null);
        setSelectedEvent(null);
        setSelectedUsers([]);
        setForm({
            eventId: '',
            title: '',
            description: '',
            No: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            place: '',
            channel: '',
            position: ''
        });
        setSearchEvent(null);
        setTaggedUsers([]);
        setInputValue('');
    };

    const handleAddEventCheckin = () => {
        const data = {
            ...form,
            eventId: form.eventId ? form.eventId : null,
            users: selectedUsers
        }

        console.log('data:',data);
        
    };

    const handleClose = () => {
        handleClear();
        onClose();
    }

    const handleActive = (active) => {
        setForm({ ...form, active: !active })
    }


    return (
        <div className="flex flex-col w-full h-full">
            {/* Header */}
            <div className="flex flex-row items-center text-white bg-[#0056FF] p-4 gap-4 w-full">
                <IoIosArrowBack size={30} onClick={handleClose}/>
                <span className="font-bold text-xl">เพิ่ม Event Check-in</span>
            </div>
            {/* Form */}
            <div className="flex flex-col text-sm gap-2 p-4 w-full">
                {/* selected event */}
                <div className="flex flex-col w-full">
                    <label htmlFor="events" className="font-bold text-sm">Select Event</label>
                    <input 
                        type="text"
                        name="events"
                        id="events"
                        value={searchEvent}
                        onChange={(e) => setSearchEvent(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder="ค้นหาข้อมูล events"
                    />
                    {filterEvents.length > 0 && (
                        <ul className="fixed inset-0 top-32 left-5 bg-white border border-gray-300 rounded-md list-none h-[300px] w-1/2 overflow-y-auto z-[99999]">
                            {filterEvents.map((event) => (
                                <li 
                                    key={event._id} 
                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectEvent(event)}
                                >
                                    {event.title}{event.No ? "- รุ่นที่ " + event.No : ""}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-row items-center gap-2 w-full">
                    <div className="flex flex-row items-center gap-2 w-2/3">
                        <label htmlFor="title" className="font-bold w-24">
                            ชื่อกิจกรรม <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholder="กรอกชื่อกิจกรรม"
                            required
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="No" className="font-bold">รุ่นที่</label>
                        <input
                            type="number"
                            name="No"
                            id="No"
                            value={form.No}
                            onChange={(e) => setForm({ ...form, No: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-16"
                            placeholder="รุ่น"
                        />
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 w-full">
                    <label htmlFor="description" className="font-bold">รายละเอียด</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="border border-gray-300 rounded-md p-2 w-1/2"
                        placeholder="กรอกรายละเอียด"
                    />
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="startDate" className="font-bold w-16">วันที่เริ่ม</label>
                        <div className="relative w-52">
                            <DatePicker
                                selected={form.startDate}
                                onChange={(date) => setForm({...form, startDate: date})}
                                className="border border-gray-300 rounded-md p-2 w-full"
                                placeholder="กรอกวันที่"
                            />
                            <FaCalendarAlt className="absolute top-3 right-10 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="endDate" className="font-bold">วันที่สิ้นสุด</label>
                        <div className="relative w-52">
                            <DatePicker
                                selected={form.endDate}
                                onChange={(date) => setForm({...form, endDate: date})}
                                className="border border-gray-300 rounded-md p-2 w-full"
                                placeholder="กรอกวันที่"
                            />
                            <FaCalendarAlt className="absolute top-3 right-10 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="startTime" className="font-bold">เวลา</label>
                        <div className="relative w-36">
                            <input
                                type="text"
                                name="startTime"
                                id="startTime"
                                value={form.startTime}
                                onChange={(e) => setForm({...form, startTime: e.target.value})}
                                className="border border-gray-300 rounded-md p-2 w-full"
                                placeholder="กรอกเวลา"
                            />
                            <FaClock className="absolute right-3 top-3 text-gray-400" />
                        </div>
                        <span>-</span>
                        <div className="relative w-36">
                            <input
                                type="text"
                                name="endTime"
                                id="endTime"
                                value={form.endTime}
                                onChange={(e) => setForm({...form, endTime: e.target.value})}
                                className="border border-gray-300 rounded-md p-2 w-full"
                                placeholder="กรอกเวลา"
                            />
                            <FaClock className="absolute right-3 top-3 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                    <label htmlFor="place" className="font-bold">สถานที่</label>
                     <input
                        type="text"
                        name="place"
                        id="place"
                        value={form.place}
                        onChange={(e) => setForm({ ...form, place: e.target.value })}
                        className="border border-gray-300 rounded-md p-2 w-1/2"
                        placeholder="กรอกสถานที่"
                    />
                </div>

                <div className="flex flex-row items-center gap-2 w-full">
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="channel" className="font-bold">Channel</label>
                        <input 
                            type="text" 
                            id="channel"
                            name="channel"
                            value={form.channel}
                            onChange={(e) => setForm({ ...form, channel: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-1/2"
                            placeholder="กรอก channel"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="position" className="font-bold">Position</label>
                        <input 
                            type="text" 
                            id="position"
                            name="position"
                            value={form.position}
                            onChange={(e) => setForm({ ...form, position: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-1/2"
                            placeholder="กรอกตำแหน่ง"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full">
                        <span className="font-bold">Active</span>
                        <button
                            className={`${form.active ? 'bg-green-500' : 'bg-red-500'} px-4 py-1 rounded-full text-white font-bold`}
                            onClick={() => handleActive(form.active)}
                        >
                            {form.active ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'}
                        </button>
                    </div>
                </div>
            </div>
            {/* selected user */}
            <div className="grid grid-cols-2 p-4 border border-gray-200 rounded-xl gap-2 w-full">
                {/* Source */}
                <div className='flex flex-col col-span-1 gap-2 p-2 border border-gray-200 rounded-lg'>
                    <label htmlFor="userJoin" className="font-bold">
                        เลือกผู้เข้าร่วม 
                        <span> ({taggedUsers.length})</span>
                        <span className="text-red-500">*</span>
                        {form.title === '' && <span className="text-xs text-red-500"> (กรุณากรอกข้อมูล event ก่อน)</span>}
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="พิมพ์ empId และ Enter"
                        className="border rounded-md text-sm p-2 w-full"
                        disabled={form.title === '' ? true : false}
                    />
                    {inputValue && (
                        <div >
                            <div className="absolute bg-white border rounded-md z-[9999] max-h-[300px] overflow-y-auto">
                            {users.filter(u => u.empId.includes(inputValue)).map(u => (
                                <div key={u.empId} 
                                    onClick={() => handleTagClick(u)} 
                                    className="p-2 text-sm hover:bg-gray-100 cursor-pointer">
                                {u.empId} - {u.fullname}
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {taggedUsers.map((id, index) => (
                        <div 
                            key={index} 
                            className="flex flex-row gap-1 items-center bg-gray-300 px-2 py-0.5 rounded-full text-sm"
                        >
                            <span>{id}</span>
                            <IoCloseCircle 
                                size={14}
                                className="text-red-500"
                                onClick={() => handleRemoveUser(index)}
                            />
                        </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleAddUsers} 
                        className={` text-white px-4 py-1 mt-2 rounded-md flex items-center gap-2 w-40
                                ${form.title === '' ? 'bg-blue-200' : 'bg-blue-500'}`}
                        disabled={form.title === '' ? true : false}
                    >
                        <FaUserPlus /> Add Users
                    </button>
                        
                </div>
                    
                {/* Selected */}
                <div className="flex flex-col col-span-1 flex-wrap border border-gray-200 rounded-xl p-2 w-full">
                    <span className="font-bold mb-2">
                        ผู้เข้าร่วม
                        <span> ({selectedUsers?.length})</span>
                    </span>
                    <div className="flex flex-row w-full gap-2">
                        {selectedUsers?.length > 0 && selectedUsers.map((user, userIdex) => (
                            <div 
                                key={userIdex} 
                                className="flex flex-row h-6 items-center px-2 py-0.5 bg-gray-300 gap-2 rounded-full "
                            >
                                <span className="flex text-xs ">
                                    {user?.empId} - {user?.fullname}
                                </span>
                                <IoCloseCircle 
                                    size={15} 
                                    className="text-red-500"
                                    onClick={() => handleJoinRemove(userIdex)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-4 mt-5 w-full">
                <button
                    className={` text-white px-4 py-1 rounded-xl
                        ${checkField ? 'bg-[#0056FF]' : 'bg-[#0056FF]/50'}
                        `}
                    onClick={handleAddEventCheckin}
                    disabled={checkField ? false : true}
                >
                    บันทึก
                </button>

                <button
                    className="bg-red-500 text-white px-4 py-1 rounded-xl"
                    onClick={handleClear}
                >
                    ยกเลิก
                </button>
            </div>

        </div>
    );
}