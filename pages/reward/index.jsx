// components/Reward.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import moment from 'moment';

const Reward = () => {
  const [rewards, setRewards] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [nextCollectTime, setNextCollectTime] = useState(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchRewards = async () => {
      const response = await axios.post('/api/reward', { userId });
      setCurrentDay(response.data.day);
      const now = moment();
      setNextCollectTime(now.clone().add(1, 'days').startOf('day').diff(now));
    };
    fetchRewards();
  }, [userId]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white text-center">
      <h2 className="mb-4 text-lg font-bold">Collect Diamonds</h2>
      <div className="flex justify-center gap-2 mb-4">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className={`p-3 w-16 h-16 rounded-lg flex items-center justify-center ${
              index + 1 <= currentDay ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <span className="text-sm font-bold">Day {index + 1}</span>
          </div>
        ))}
      </div>
      {nextCollectTime ? (
        <div className="text-sm">
          Next collection in: {moment.duration(nextCollectTime).hours()}:
          {moment.duration(nextCollectTime).minutes()}:
          {moment.duration(nextCollectTime).seconds()}
        </div>
      ) : (
        <div className="text-sm text-green-500">Ready to collect!</div>
      )}
    </div>
  );
};

export default Reward;
