import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const rewardData = [
  { day: 1, point: 1, icon: "/images/reward/day1.png" },
  { day: 2, point: 2, icon: "/images/reward/day2.png" },
  { day: 3, point: 3, icon: "/images/reward/day3.png" },
  { day: 4, point: 3, icon: "/images/reward/day4.png" },
  { day: 5, point: 3, icon: "/images/reward/day5.png" },
  { day: 6, point: 3, icon: "/images/reward/day6.png" },
  { day: 7, point: 10, icon: "/images/reward/day7.png" },
];

export default function RewardPanel() {
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;
    if (userId) {
      fetchUserReward();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserReward = async () => {
    try {
      const res = await axios.get(`/api/reward?userId=${userId}`);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setCurrentDay(res.data.dayLogged);

      if (res.data.lastRewardDate) {
        const lastRewardDate = new Date(res.data.lastRewardDate);
        lastRewardDate.setHours(0, 0, 0, 0);
        setClaimedToday(lastRewardDate.getTime() === today.getTime());
      } else {
        setClaimedToday(false);
      }
    } catch (error) {
      console.error("Error fetching reward data:", error);
    }
  };

  const handleClaimReward = async () => {
    if (loading || claimedToday) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/reward", { userId });
      setCurrentDay(res.data.dayLogged);
      setClaimedToday(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);

      const earnedReward = rewardData.find((r) => r.day === res.data.dayLogged);

      if (earnedReward) {
        Swal.fire({
          title: "🎉 รับรางวัลสำเร็จ!",
          text: `คุณได้รับ ${earnedReward.point} คะแนน`,
          imageUrl: earnedReward.icon,
          imageWidth: "auto",
          imageHeight: 150,
          imageAlt: "Reward Icon",
          confirmButtonText: "รับทราบ",
        });
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถรับรางวัลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ปิด",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col bg-[#f68b1f] px-2 py-4 items-center gap-2 rounded-xl w-full">
        <div className="flex flex-row items-start justify-between w-full">
          {rewardData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index + 1 === currentDay && animate ? 1.2 : 1,
                opacity: 1,
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Image
                src={item.icon}
                alt="Point"
                width={200}
                height={200}
                className={`object-contain h-16 w-full ${
                  index + 1 <= currentDay ? "" : "grayscale"
                }`}
                priority
              />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-2 w-full">
          <Image
            src="/images/reward/star1.png"
            alt="Point"
            width={30}
            height={30}
          />
          <motion.button
            className={`px-8 py-2 bg-[#933100] text-white font-bold rounded-full transition-all ${
              claimedToday || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={claimedToday || loading}
            onClick={handleClaimReward}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: animate ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            {claimedToday ? "เช็คอินวันนี้แล้ว" : "เช็คอินวันนี้เพื่อรับ POINT"}
          </motion.button>
          <Image
            src="/images/reward/star2.png"
            alt="Point"
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
  );
}
