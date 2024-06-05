"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";


  const fetchPoints = async (userId) => {
    try {
      const response = await fetch(`/api/loginreward/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'WELCOME LOGIN',
          text: `คุณได้รับ ${data.points} points`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.href = '/pulsesurvey';
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: data.error,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const checkPointStatus = async (userId) => {
    try {
      const response = await fetch(`/api/loginreward/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data.receivedPointsToday;
    } catch (error) {
      console.error('Error checking point status:', error);
      return false;
    }
  };
  

const loginreward = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session, status } = useSession();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [receivedPointsToday, setReceivedPointsToday] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (status === 'authenticated' && session) {
        const userId = session.user.id;
        checkPointStatus(userId).then(setReceivedPointsToday);
      }
    }, [session, status]);
  
    const handleFetchPoints = async () => {
      if (session && session.user) {
        setLoading(true);
        await fetchPoints(session.user.id);
        setLoading(false);
      }
    };
  
    const handleGoToMain = () => {
      window.location.href = '/pulsesurvey';
    };

    const loginPercent = receivedPointsToday /30 * 100;


    const LineProgressBar = dynamic(() => import("@/components/LineProgressBar"), {ssr: false});

    const items = Array.from({ length: 30 }, (_, i) => i + 1);
    const getImageSrc = (index) => {
        if (index <= 10) return '/images/loginreward/Asset198.svg';
        if (index <= 20) return '/images/loginreward/Asset196.svg';
        return '/images/loginreward/Asset197.svg';
    };
    

    return (
        <main className="flex items-center justify-center bg-[#0056FF]" style={{ minheight: "100vh", width: "100%" }}>
            <div className="flex items-center text-center justify-center p-4 min-h-[100vh]">
                <div className="relative bg-white p-2 rounded-xl">
                    <div className="flex flex-col p-2">
                        <div className="flex items-center text-center justify-center mt-[20px]">
                            <span className="text-[35px] font-black text-[#0056FF] dark:text-white">LOGIN</span>
                            <span className="text-[35px] font-black text-[#F2871F] dark:text-white ml-2">REWARD</span>
                        </div>

                        <div className="relative mb-8 mt-10">
                            <LineProgressBar percent={loginPercent} />
                        </div>

                        <div className="grid grid-cols-5 gap-1 mb-3">
                        {items.map((item) => (
                            <div
                            key={item}
                            className={`flex-col inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-x-hidden border-2 border-[#C7DFF5] rounded-lg ${item <= receivedPointsToday ? 'bg-[#C7DFF5]/80' : ''}`}
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
                        {receivedPointsToday ? (
                          <button
                            onClick={handleGoToMain}
                            className="bg-[#F68B1F] text-white font-bold py-2 px-4 rounded"
                          >
                            ไปยังหน้าหลัก
                          </button>
                          ) : (
                          <button
                            onClick={handleFetchPoints}
                            disabled={loading}
                            className="bg-[#F68B1F] text-white font-bold py-2 px-4 rounded"
                          >
                            {loading ? 'Loading...' : 'รับคะแนน'}
                          </button>
                        )}
                    </div>

                </div>
            </div>
        </main>

        
    );
}

export default loginreward;