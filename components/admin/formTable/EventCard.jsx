const EventCard = ({ event }) => {
    return (
      <div>
        <h3>{event.name}</h3>
        <p>วันที่เริ่มต้น: {new Date(event.startdate).toLocaleDateString('th-TH')}</p>
        <p>เวลา: {event.time}</p>
        <p>วันที่สิ้นสุด: {new Date(event.enddate).toLocaleDateString('th-TH')}</p>
        <p>กลุ่ม: {event.group}</p>
        <p>ตำแหน่ง: {event.position}</p>
        <p>สถานที่: {event.location}</p>
        <p>แผนที่: {event.maplocation}</p>
        <p>หมายเหตุ: {event.note}</p>
      </div>
    );
  };
  
  export default EventCard;