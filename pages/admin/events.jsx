import { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Header from '@/components/admin/global/Header';
import { AdminLayout } from '@/themes';
import Events from '@/components/events/Events';
import CheckIn from '@/components/events/CheckInnew';
import { Divider } from '@mui/material';
import Loading from '@/components/Loading';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [active, setActive] = useState('events');

  const { data, error, mutate } = useSWR('/api/events', fetcher, {
    onSuccess: (data) => {
      setEvents(data.data);
    }
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <Loading />;

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

      {active === 'events' && <Events events={events} mutate={mutate} />}

      {active === 'checkin' && <CheckIn events={events} mutate={mutate} />}

    </div>
  );
}

ManageEvents.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
ManageEvents.auth = true;

export default ManageEvents;
