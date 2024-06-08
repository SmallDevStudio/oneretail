import { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/events', form);
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
    const response = await axios.get('/api/events');
    setEvents(response.data.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/events/${id}`);
    const response = await axios.get('/api/events');
    setEvents(response.data.data);
  };

  return (
    <div>
      <h1>Manage Events</h1>
      <form onSubmit={handleSubmit}>
        {/* Add form fields here */}
        <button type="submit">Add Event</button>
      </form>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            {event.title} - {event.startDate}
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEvents;