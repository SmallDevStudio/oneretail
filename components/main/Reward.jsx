import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const Reward = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchUserReward();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserReward = async () => {
    try {
      const res = await axios.get(`/api/reward?userId=${userId}`);
      setCurrentDay(res.data.dayLogged);

      // ตรวจสอบว่าได้รับ reward วันนี้หรือยัง
      if (res.data.lastRewardDate) {
        const lastRewardDate = new Date(res.data.lastRewardDate);
        const today = new Date();
        lastRewardDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (lastRewardDate.getTime() === today.getTime()) {
          setClaimedToday(true);
        } else {
          setClaimedToday(false);
        }
      }
    } catch (error) {
      console.error('Error fetching reward data:', error);
    }
  };

  const handleClaimReward = async () => {
    if (loading || claimedToday) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/reward', { userId });
      setCurrentDay(res.data.dayLogged);
      setClaimedToday(true);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg text-center px-4">
      <h2 className="mb-4 text-lg text-[#0056FF] text-center font-bold">Login Reward</h2>
      <div className="flex flex-row justify-center gap-2 mb-4">
        {[...Array(7)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              index + 1 <= currentDay ? 'bg-[#0056FF] text-white' : 'bg-gray-200 text-gray-300'
            }`}
          >
            <span className="text-sm font-bold">Day {index + 1}</span>
          </motion.div>
        ))}
      </div>
      <div>
        <button
          onClick={handleClaimReward}
          disabled={claimedToday || loading}
          className={`py-2 px-4 rounded font-bold text-white transition-all ${
            claimedToday ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F2871F] hover:bg-[#F2871F]/80 cursor-pointer'
          }`}
        >
          {claimedToday ? 'Reward แล้ว' : loading ? 'Processing...' : 'Reward'}
        </button>
      </div>
    </div>
  );
};

export default Reward;
