import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { AdminLayout } from '@/themes';
import moment from 'moment';
import DatePicker, { registerLocale } from 'react-datepicker';
import th from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import Modal from '@/components/Modal';

registerLocale('th', th);

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
  
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
      setFilteredEvents(response.data.data); // Initialize filtered events with all events
    };
    fetchEvents();
  }, []);

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
    { field: 'note', headerName: 'Note', width: 150 },
    { field: 'creator', headerName: 'Creator', width: 80 },
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
          <div style={{ height: 650, width: '100%' }}>
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
      </div>
    </React.Fragment>
  );
};

ManageEvents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ManageEvents.auth = true;

export default ManageEvents;
