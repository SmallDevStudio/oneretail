import { useState } from 'react';
import axios from 'axios';

const EventTable = ({ events }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;
  
  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/events', { data: { id } });
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = async (event) => {
    // Add your edit logic here
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ชื่อกิจกรรม</th>
            <th>วันที่เริ่มต้น</th>
            <th>วันที่สิ้นสุด</th>
            <th>กลุ่ม</th>
            <th>ตำแหน่ง</th>
            <th>สถานที่</th>
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
              <td>{event.position}</td>
              <td>{event.location}</td>
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

export default EventTable;