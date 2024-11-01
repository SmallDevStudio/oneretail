import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/admin/global/Header';
import { AdminLayout } from '@/themes';
import Events from '@/components/events/Events';
import { Divider } from '@mui/material';

const ManageEvents = () => {
  const [active, setActive] = useState('events');

  return (
    <div>
      <Header title={'Events'} subtitle={'จัดการกิจกรรม'} />
      <div className="flex flex-row items-center justify-center w-full gap-8">
        <button
          className={`${active === 'events' ? 'text-[#0056FF] font-bold border-b-2 border-[#F2871F]' : 'text-gray-400'}
           p-2 text-center`}
          onClick={() => setActive('events')}
        >
          จัดการกิจกรรม
        </button>

        <button
          className={`${active === 'checkin' ? 'text-[#0056FF] font-bold border-b-2 border-[#F2871F]' : 'text-gray-400'}
           p-2 text-center`}
          onClick={() => setActive('checkin')}
        >
          Check-In
        </button>
      </div>

      {active === 'events' && <Events />}

    </div>
  );
}

ManageEvents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ManageEvents.auth = true;

export default ManageEvents;
