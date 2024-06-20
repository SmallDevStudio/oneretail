// loginreward
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR, { mutate } from "swr";
import Loading from "@/components/Loading";
import LoginModal from "@/components/LoginModal";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Loginreward = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const router = useRouter();
  const userId = session?.user?.id;

  const { data: loginData, error: loginDataError, isLoading: isLoginDataLoading } = useSWR(
    () => userId ? `/api/loginreward/${userId}` : null, 
    fetcher
  );

  useEffect(() => {
    if (loginData?.receivedPointsToday && !modalOpen) {
      router.push("/checkSurvey");
    }
  }, [loginData, router, modalOpen]);

  const LineProgressBar = dynamic(() => import("@/components/LineProgressBar"), { ssr: false });

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/loginreward/${userId}`);
      const { points } = response.data;
      setPoints(points);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setLoading(false);
    }
  };

  const percent = loginData?.day ? Math.round((loginData.day / 30) * 100) : 0;

  const items = Array.from({ length: 30 }, (_, i) => i + 1);
  const getImageSrc = (index) => {
    if (index <= 10) return '/images/loginreward/Asset198.svg';
    if (index <= 20) return '/images/loginreward/Asset196.svg';
    return '/images/loginreward/Asset197.svg';
  };

  const handleModalClose = async () => {
    setModalOpen(false);
    mutate(`/api/loginreward/${userId}`); // Re-fetch data
  };

  if (loginDataError) return <div>Error: {loginDataError.message}</div>;
  if (isLoginDataLoading || !loginData ) return <Loading />;

  return (
    <main className="flex items-center justify-center bg-[#0056FF]" style={{ minHeight: "100vh", width: "100%" }}>
      <div className="flex items-center text-center justify-center p-4 min-h-[100vh]">
        <div className="relative bg-white p-2 rounded-xl">
          <div className="flex flex-col p-2">
            <div className="flex items-center text-center justify-center mt-[20px]">
              <span className="text-[35px] font-black text-[#0056FF] dark:text-white">LOGIN</span>
              <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">REWARD</span>
            </div>

            <div className="relative mb-8 mt-10">
              {LineProgressBar && <LineProgressBar percent={percent} />}
            </div>

            <div className="grid grid-cols-5 gap-1 mb-3">
              {items.map((item) => (
                <div
                  key={item}
                  className={`flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden border-2 border-[#C7DFF5] rounded-lg ${item <= (loginData?.day % 30) ? 'bg-[#C7DFF5]/70' : ''}`}
                  style={{ width: 60, height: 60 }}
                  id={item.toString()}
                >
                  <Image
                    src={getImageSrc(item)}
                    alt={`Reward ${item}`}
                    width={40}
                    height={40}
                    className="relative"
                  />
                  <span className="absolute text-white mt-16 mb-1 pz-1 bg-[#C7DFF5] font-bold rounded-lg text-[8px] w-8">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleClick}
              disabled={loading}
              className="bg-[#F68B1F] text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Loading...' : 'รับคะแนน'}
            </button>
          </div>
        </div>
      </div>
      {modalOpen && <LoginModal point={points} onRequestClose={handleModalClose} />}
    </main>
  );
}

export default Loginreward;
