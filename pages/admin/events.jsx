// pages/events.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { AdminLayout } from '@/themes';
import moment from 'moment';
import DatePicker, { registerLocale } from 'react-datepicker';
import th from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('th', th);

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    group: '',
    position: '',
    place: '',
    mapLocation: '',
    note: '',
    status: '',
    creator: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/events/${editId}`, form);
    } else {
      await axios.post('/api/events', form);
    }
    setForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      group: '',
      position: '',
      place: '',
      mapLocation: '',
      note: '',
      status: '',
      creator: ''
    });
    setEditId(null);
    const response = await axios.get('/api/events');
    setEvents(response.data.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/events/${id}`);
    const response = await axios.get('/api/events');
    setEvents(response.data.data);
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      startDate: new Date(event.startDate).toISOString().split('T')[0],
      endDate: new Date(event.endDate).toISOString().split('T')[0],
      startTime: event.startTime,
      endTime: event.endTime,
      group: event.group,
      position: event.position,
      place: event.place,
      mapLocation: event.mapLocation,
      note: event.note,
      status: event.status,
      creator: event.creator
    });
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'description', width: 200},
    { field: 'startDate', headerName: 'Start Date', width: 150, renderCell: (params) => moment(params.value).format('DD/MM/YYYY') },
    { field: 'endDate', headerName: 'End Date', width: 150, renderCell: (params) => moment(params.value).format('DD/MM/YYYY') },
    { field: 'startTime', headerName: 'startTime', width: 80 },
    { field: 'endTime', headerName: 'endTime', width: 80 },
    { field: 'group', headerName: 'group', width: 80 },
    { field: 'place', headerName: 'place', width: 150 },
    { field: 'note', headerName: 'note', width: 150 },
    { field: 'creator', headerName: 'creator', width: 80 },
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
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
      <div className=" mb-2"> 
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          getRowId={(row) => row._id}
        />
      </div>
    </div>
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Add form fields here */}
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded"
          />
          <DatePicker
            selected={form.startDate ? new Date(form.startDate) : null}
            onChange={(date) => setForm({ ...form, startDate: date.toISOString().split('T')[0] })}
            className="p-2 border rounded"
            placeholderText="Start Date"
            locale="th"
            dateFormat="dd/MM/yyyy"
          />
          <DatePicker
            selected={form.endDate ? new Date(form.endDate) : null}
            onChange={(date) => setForm({ ...form, endDate: date.toISOString().split('T')[0] })}
            className="p-2 border rounded"
            placeholderText="End Date"
            locale="th"
            dateFormat="dd/MM/yyyy"
          />
          <input
            type="text"
            placeholder="startTime"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="endTime"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="group"
            value={form.group}
            onChange={(e) => setForm({ ...form, group: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="place"
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="p-2 border rounded"
          />
          {/* Add other form fields similarly */}
          {/* ... */}
        </div>
        <button type="submit" className="mt-4 p-2 bg-blue-600 text-white rounded">
          {editId ? 'อัพเดท Event' : 'เพิ่ม Event'}
        </button>
      </form>
      
    </div>
    
  </React.Fragment>
  );
};

ManageEvents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ManageEvents.auth = true;

export default ManageEvents;
