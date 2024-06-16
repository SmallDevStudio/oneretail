"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AppLayout } from "@/themes";
import { Suspense } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import ExchangeModal from "@/components/ExchangeModal";
import NotificationModal from "@/components/NotificationModal";
import { toast } from "react-toastify";
import LoadingFeed from "@/components/LoadingFeed";
import moment from "moment";
moment.locale("th");

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Redeem() {
    const [activeTab, setActiveTab] = useState("redeem1");
    const { data: session } = useSession();
    const { image, id } = session?.user;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [notificationModalIsOpen, setNotificationModalIsOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [conversionRate, setConversionRate] = useState(20);
    const [userPoints, setUserPoints] = useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [redeems, setRedeems] = useState(null);
    const [redeemTransData, setRedeemTransData] = useState(null);
    const [selectedRedeem, setSelectedRedeem] = useState(null);
  
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const openNotificationModal = (message) => {
      setNotificationMessage(message);
      setNotificationModalIsOpen(true);
    };
    const closeNotificationModal = () => setNotificationModalIsOpen(false);
  
    const { data: level } = useSWR('/api/level/user?userId=' + session?.user?.id, fetcher);
    const { data: coins } = useSWR('/api/coins/user?userId=' + session?.user?.id, fetcher, {
      onSuccess: (data) => {
        setUserCoins(data.coins);
      }
    });
    const { data: points } = useSWR('/api/points/user?userId=' + session?.user?.id, fetcher, {
      onSuccess: (data) => {
        setUserPoints(data.point);
      }
    });
    const { data: redeem } = useSWR('/api/redeem', fetcher, {
      onSuccess: (data) => {
        setRedeems(data.data);
      }
    });
  
    const { data: redeemtrans } = useSWR('/api/redeemtrans?userId=' + session?.user?.id, fetcher, {
      onSuccess: (data) => {
        setRedeemTransData(data.data);
      }
    });
  
    useEffect(() => {
      if (coins?.coins) {
        setUserCoins(coins.coins);
      }
      if (points?.point) {
        setUserPoints(points.point);
      }
    }, [coins, points]);
  
    const handleRedeemClick = (redeemItem) => {
      setSelectedRedeem(redeemItem);
      if (userPoints >= redeemItem.point && userCoins >= redeemItem.coins) {
        redeemItem.stock -= 1;
        createRedeemTransaction(redeemItem);
      } else {
        openNotificationModal("จำนวน point และ coins ไม่พอ");
      }
    };
  
    const createRedeemTransaction = async (redeemItem) => {
      console.log("createRedeemTransaction", redeemItem);
      try {
        const response = await fetch('/api/redeemtrans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            redeemId: redeemItem._id,
            userId: session?.user?.id,
            coins: redeemItem.coins,
            point: redeemItem.point,
          }),
        });
  
        if (response.ok) {
          const updatedRedeem = await response.json();
          setRedeems((prev) => prev.map((r) => (r._id === updatedRedeem._id ? updatedRedeem : r)));
          toast.success('Redeemed successfully!');
        } else {
          toast.error('Failed to redeem.');
        }
      } catch (error) {
        toast.error('Failed to redeem.');
      }
    };
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
  
    return (
      <main className="flex flex-col bg-white min-w-[100vw]">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mt-10">
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center mb-8">
            <Image
              src={image}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
            <Image
              src="/images/profile/Badge.svg"
              alt="Badge"
              width={140}
              height={140}
              className="absolute z-12 mb-5"
            />
            <span className="relative z-12 text-white font-bold mt-3 text-[10px]">
              LEVEL {level?.level}
            </span>
          </div>
          {/* Point & Coins */}
          <div className="flex items-center justify-between w-full px-5 pz-5">
            <div className="flex items-end">
              <div className="flex flex-row items-end gap-2" style={{
                fontFamily: "Ekachon",
                fontSmoothing: "auto",
                fontWeight: "black",
                alignItems: "end",
              }}>
                <Image
                  src="/images/profile/Coin.svg"
                  alt="coins"
                  width={32}
                  height={32}
                  className="flex"
                />
                <span className="text-xl text-[#0056FF] font-black">
                  {coins?.coins ? coins?.coins : 0}
                </span>
                <span className="text-lg text-[#0056FF] font-black">
                  Coins
                </span>
              </div>
            </div>
            <div className="flex items-end">
              <div className="flex flex-row items-end gap-2" style={{
                fontFamily: "Ekachon",
                fontSmoothing: "auto",
                fontWeight: "black",
                alignItems: "end",
              }}>
                <Image
                  src="/images/profile/Point.svg"
                  alt="points"
                  width={30}
                  height={30}
                  className="flex"
                />
                <span className="text-lg text-[#0056FF] font-bold">
                  Total Point
                </span>
                <span className="text-lg text-[#0056FF] font-bold">
                  {points?.point ? points?.point : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mr-5 mb-2">
          <span className="text-[10px] text-[#1E3060] font-bold">
            เปลี่ยนคะแนน เป็น คอยล์
            <button>
              <span className="text-[#F68B1F] font-bold ml-1" onClick={openModal}>คลิก</span>
            </button>
          </span>
        </div>
        {/* Tabs */}
        <div className="flex items-center justify-center">
          <ul className="flex flex-row w-[340px] font-bold">
            <li>
              <div className={`flex  w-[170px] h-[40px] items-center justify-center text-center rounded-l-3xl ${activeTab === 'redeem1' ? 'bg-[#0056FF] text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => handleTabClick('redeem1')}
              >
                <span>แลกของรางวัล</span>
              </div>
            </li>
            <li>
              <div className={`flex  w-[170px] h-[40px] items-center justify-center text-center rounded-r-3xl ${activeTab === 'redeem2' ? 'bg-[#F68B1F] text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => handleTabClick('redeem2')}
              >
                <span>ของที่แลกแล้ว</span>
              </div>
            </li>
          </ul>
        </div>
        <ExchangeModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          points={userPoints}
          conversionRate={conversionRate}
          userId={id}
        />
        <NotificationModal
          isOpen={notificationModalIsOpen}
          onRequestClose={closeNotificationModal}
          message={notificationMessage}
        />
        {/* Content */}
        <div className="flex flex-col items-center justify-center p-5 gap-2 mb-20">
          {activeTab === 'redeem1' && (
            <Suspense fallback={<LoadingFeed />}>
              {redeems?.map((redeemItem) => (
                <div key={redeemItem._id} className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={redeemItem.image}
                      alt={redeemItem.name}
                      width={150}
                      height={150}
                      className="flex p-2"
                      style={{
                        minWidth: "150px",
                        maxHeight: "120px",
                        objectFit: "contain",
                      }}
                    />
                    <div style={{
                      position: "relative",
                      bottom: "10px",
                      left: "35px",
                    }}>
                      <div className="flex flex-row bg-[#0056FF] rounded-full text-white font-bold h-6 w-[70px] p-1 text-center justify-center items-center">
                        <span className="flex text-sm">{redeemItem.coins} 
                          <Image
                            src="/images/profile/Coin.svg"
                            alt="coins"
                            width={15}
                            height={15}
                            className="flex ml-2"
                          />  
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-grow p-2">
                    <div>
                      <div className="text-lg font-bold text-[#0056FF]">
                        {redeemItem.name}
                      </div>
                      <div>
                        <span className="text-[12px] line-clamp-2">
                          {redeemItem.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex-col text-left">
                        <span className="text-[0.7em]">
                          คงเหลือ
                        </span>
                        <span className="flex font-bold mt-[-5px]">
                          {redeemItem.stock} สิทธิ์
                        </span>
                      </div>
                      <button
                        className="bg-[#F68B1F] rounded-full text-white font-medium h-8 px-4"
                        onClick={() => handleRedeemClick(redeemItem)}
                      >
                        redeem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Suspense>
          )}
  
          {activeTab === 'redeem2' && (
            <Suspense fallback={<LoadingFeed />}>
              {redeemTransData?.map((transItem) => (
                <div key={transItem._id} className="flex flex-row w-full bg-gray-300 rounded-xl p-1">
                  <Image
                    src={transItem.redeemId.image}
                    alt={transItem.redeemId.name}
                    width={150}
                    height={150}
                    className="flex p-2"
                    style={{
                      minWidth: "150px",
                      maxHeight: "120px",
                      objectFit: "contain",
                    }}
                  />
                  <div className="flex flex-col justify-between flex-grow p-2">
                    <div className="flex flex-col">
                      <div className="flex justify-end mb-[-10px]">
                        <span className="flex text-[10px] font-bold">
                            {moment(transItem.createdAt).fromNow()}
                        </span>
                      </div>
                        <div className="flex text-lg font-bold text-[#0056FF]">
                          {transItem.redeemId.name}
                        </div>
                      <div>
                        <span className="text-[12px] line-clamp-2">
                          {transItem.redeemId.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end pt-2">
                      {transItem.redeemId.coins > 0 && (
                        <div className="text-left">
                        <span className="text-[0.7em] font-bold">
                          Coins
                        </span>
                        <span className="font-bold ml-1 text-[#0056FF]">
                          {transItem.coins}
                        </span>
                      </div>
                      )}
                      {transItem.redeemId.points > 0 && (
                        <div className="text-left ml-2">
                          <span className="text-[0.7em]">
                            Points
                          </span>
                          <span className="font-bold ml-1">
                            {transItem.redeemId.points}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Suspense>
          )}
        </div>
      </main>
    );
  }
  
  Redeem.getLayout = function getLayout(page) {
    return (
      <AppLayout>
        {page}
      </AppLayout>
    );
  }
  
  Redeem.auth = true;