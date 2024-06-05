import { useState } from 'react';

const EventList = ({ events }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const showMoreEvents = () => {
    setVisibleCount(visibleCount + 3);
  };

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <div className="flex flex-col border-2 border-[#0056FF] rounded-lg p-2">
      {visibleEvents.map(event => (
        <div key={event._id}>
          <h3 className="font-bold">
            {new Date(event.startdate).toLocaleDateString('th-TH')} - {event.time}
          </h3>
          <div className="flex flex-col">
            <span className="font-bold text-md mr-2">กลุ่ม: <span className="font-normal">{event.group}</span></span>
            <span className="font-bold text-md mr-2">ชื่อ: <span className="font-normal">{event.name}</span></span> 
            <span className="font-bold text-sm mr-2">รายละเอียด: <span className="font-normal">{event.description}</span></span>
            <span className="font-bold text-sm mr-2">สถานที่: <span className="font-normal">{event.location}</span></span>
          </div>
        </div>
      ))}
      {visibleCount < events.length && (
        <button onClick={showMoreEvents}>อ่านเพิ่มเติม</button>
      )}
    </div>
  );
};

export default EventList;