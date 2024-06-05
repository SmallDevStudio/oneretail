import { useEffect, useState } from 'react';
import axios from 'axios';

const Manage = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: '',
    startdate: '',
    time: '',
    enddate: '',
    name: '',
    description: '',
    group: '',
    position: '',
    location: '',
    maplocation: '',
    note: '',
  });
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put('/api/events', form);
    } else {
      await axios.post('/api/events', form);
    }
    fetchEvents();
    setForm({
      id: '',
      startdate: '',
      time: '',
      enddate: '',
      name: '',
      description: '',
      group: '',
      position: '',
      location: '',
      maplocation: '',
      note: '',
    });
    setEditing(false);
  };

  const handleEdit = event => {
    setForm(event);
    setEditing(true);
  };

  const handleDelete = async id => {
    await axios.delete('/api/events', { data: { id } });
    fetchEvents();
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>จัดการกิจกรรม</h1>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={form.id} />
        <label>วันที่เริ่มต้น:</label>
        <input
          type="date"
          name="startdate"
          value={form.startdate}
          onChange={handleInputChange}
          required
        />
        <label>เวลา:</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleInputChange}
          required
        />
        <label>วันที่สิ้นสุด:</label>
        <input
          type="date"
          name="enddate"
          value={form.enddate}
          onChange={handleInputChange}
        />
        <label>ชื่อกิจกรรม:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <label>รายละเอียด:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          required
        ></textarea>
        <label>กลุ่ม:</label>
        <input
          type="text"
          name="group"
          value={form.group}
          onChange={handleInputChange}
        />
        <label>ตำแหน่ง:</label>
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleInputChange}
        />
        <label>สถานที่:</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleInputChange}
        />
        <label>แผนที่:</label>
        <input
          type="text"
          name="maplocation"
          value={form.maplocation}
          onChange={handleInputChange}
        />
        <label>หมายเหตุ:</label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleInputChange}
        />
        <button type="submit">{editing ? 'แก้ไข' : 'เพิ่ม'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ชื่อกิจกรรม</th>
            <th>วันที่เริ่มต้น</th>
            <th>วันที่สิ้นสุด</th>
            <th>กลุ่ม</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map(event => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>{new Date(event.startdate).toLocaleDateString('th-TH')}</td>
              <td>{new Date(event.enddate).toLocaleDateString('th-TH')}</td>
              <td>{event.group}</td>
              <td>
                <button onClick={() => handleEdit(event)}>แก้ไข</button>
                <button onClick={() => handleDelete(event._id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        eventsPerPage={eventsPerPage}
        totalEvents={events.length}
        paginate={paginate}
      />
    </div>
  );
};

const Pagination = ({ eventsPerPage, totalEvents, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalEvents / eventsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul>
        {pageNumbers.map(number => (
          <li key={number}>
            <a onClick={() => paginate(number)} href="#">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Manage;