"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AppLayout } from "@/themes";
import { Suspense } from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import ExchangeModal from "@/components/ExchangeModal";
import NotificationModal from "@/components/NotificationModal";
import RedeemModal from "@/components/RedeemModal";
import RedeemSuccessModal from "@/components/RedeemSuccessModal";
import LoadingFeed from "@/components/LoadingFeed";
import Loading from "@/components/Loading";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { Divider } from "@mui/material";
import Modal from "@/components/Modal";

moment.locale("th");

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Redeem() {
  const [activeTab, setActiveTab] = useState("redeem");
  const { data: session, status } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [redeemModalIsOpen, setRedeemModalIsOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedRedeem, setSelectedRedeem] = useState(null);
  const [conversionRate, setConversionRate] = useState(25);
  const [userPoints, setUserPoints] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [redeems, setRedeems] = useState(null);
  const [redeemTransData, setRedeemTransData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
  }, [status]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openNotificationModal = (message) => {
    setNotificationMessage(message);
    setNotificationModalIsOpen(true);
  };
  const closeNotificationModal = () => setNotificationModalIsOpen(false);
  const openRedeemModal = (redeemItem) => {
    setSelectedRedeem(redeemItem);
    setRedeemModalIsOpen(true);
  };
  const closeRedeemModal = () => {
    setRedeemModalIsOpen(false);
    setSelectedRedeem(null);
  };

  const { data: level, mutate: mutateLevel } = useSWR(
    "/api/level/user?userId=" + session?.user?.id,
    fetcher,
    {
      onSuccess: (data) => {
        setUserPoints(data.point);
      },
    }
  );
  const { data: coins, mutate: mutateCoins } = useSWR(
    "/api/coins/user?userId=" + session?.user?.id,
    fetcher,
    {
      onSuccess: (data) => {
        setUserCoins(data.coins);
      },
    }
  );

  const { data: redeem, mutate: mutateRedeem } = useSWR(
    "/api/redeem",
    fetcher,
    {
      onSuccess: (data) => {
        setRedeems(data.data);
      },
    }
  );

  const { data: redeemtrans, mutate: mutateRedeemTrans } = useSWR(
    "/api/redeemtrans?userId=" + session?.user?.id,
    fetcher,
    {
      onSuccess: (data) => {
        setRedeemTransData(data.data);
      },
    }
  );

  const handleRedeemClick = async (redeemItem) => {
    setSelectedRedeem(redeemItem);
    if (redeemItem.stock <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "สิทธิ์ของคุณหมดแล้ว.",
      });
    }

    if (userCoins < redeemItem.coins) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ยอด coins ของคุณไม่เพียงพอ.",
      });
    } else {
      const result = await Swal.fire({
        title: "ยืนยันการแลกสินค้า",
        text: `คุณต้องการแลก ${redeemItem.name} ใช่หรือไม่`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่ใช่",
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post("/api/redeemtrans", {
            redeemId: redeemItem._id,
            userId: session?.user?.id,
          });

          if (response.data.success) {
            setSelectedRedeem(null);
            closeRedeemModal();
            Swal.fire("สําเร็จ", "แลกสินค้าสําเร็จ", "success");
            mutateCoins();
            mutateRedeem();
            mutateRedeemTrans();
            setActiveTab("redeemtrans");
          } else {
            Swal.fire("เกิดข้อผิดพลาด", "แลกสินค้าไม่สําเร็จ", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("เกิดข้อผิดพลาด", "แลกสินค้าไม่สําเร็จ", "error");
        }
      }
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const onExchangeAdd = async () => {
    mutateCoins();
    mutateLevel();
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
  };

  const handleClaimCoupon = async () => {
    setIsClaimed(true);
    if (!code || code.trim() === "") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "กรุณากรอกโค้ด",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const response = await axios.post("/api/coupons/claim", {
        code,
        userId: userId,
      });

      if (response.data.success) {
        setCode("");
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "คุณได้รับคูปองเรียบร้อยแล้ว",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      let errorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setCode("");
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } finally {
      setIsClaimed(false);
    }
  };

  if (!level || !coins || !redeem || !redeemtrans) return <Loading />;

  return (
    <main className="flex flex-col bg-white min-w-[100vw]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mt-6">
        {/* Avatar */}
        <div className="flex flex-col justify-start items-start mb-4 w-full px-6">
          <span className="text-lg font-bold">
            สวัสดี {level?.user?.fullname}
          </span>
        </div>
        {/* Point & Coins */}
        <div className="flex items-center justify-between w-full px-5 pz-5">
          <div className="flex items-end">
            <div
              className="flex flex-row items-end gap-2"
              style={{
                fontFamily: "Ekachon",
                fontSmoothing: "auto",
                fontWeight: "black",
                alignItems: "end",
              }}
            >
              <Image
                src="/images/profile/Coin.svg"
                alt="coins"
                width={32}
                height={32}
                className="flex"
              />
              <span className="text-xl text-[#0056FF] font-black">
                {userCoins ? userCoins : 0}
              </span>
              <span className="text-lg text-[#0056FF] font-black">Coins</span>
            </div>
          </div>
          <div className="flex items-end">
            <div
              className="flex flex-row items-end gap-2"
              style={{
                fontFamily: "Ekachon",
                fontSmoothing: "auto",
                fontWeight: "black",
                alignItems: "end",
              }}
            >
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
                {userPoints ? userPoints : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mr-5 mb-1 mt-1">
        <span className="text-xs text-[#1E3060] font-bold">
          เปลี่ยนคะแนน เป็น คอยน์
          <button>
            <span className="text-[#F68B1F] font-bold ml-1" onClick={openModal}>
              คลิก
            </span>
          </button>
        </span>
      </div>
      {/* Claim */}
      <div className="flex px-4 mb-4">
        <div className="flex flex-col w-full bg-[#0056FF] rounded-xl px-4 py-4 gap-1">
          <span className="text-white font-bold">Code :</span>
          <div className="flex flex-row items-center gap-2 mb-2">
            <input
              type="text"
              className="w-full border rounded-full px-2 py-1 text-black"
              placeholder="ใส่รหัสโค้ดที่นี่"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="flex items-center justify-center bg-[#F68B1F] rounded-full px-4 py-1 text-white"
              onClick={handleClaimCoupon}
              disabled={isClaimed}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex items-center justify-center">
        <ul className="flex flex-row w-[340px] font-bold">
          <li>
            <div
              className={`flex  w-[170px] h-[40px] items-center justify-center text-center rounded-l-3xl ${
                activeTab === "redeem"
                  ? "bg-[#0056FF] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => handleTabClick("redeem")}
            >
              <span>แลกของรางวัล</span>
            </div>
          </li>
          <li>
            <div
              className={`flex  w-[170px] h-[40px] items-center justify-center text-center rounded-r-3xl ${
                activeTab === "redeemtrans"
                  ? "bg-[#F68B1F] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => handleTabClick("redeemtrans")}
            >
              <span>ของที่แลกแล้ว</span>
            </div>
          </li>
        </ul>
      </div>
      <ExchangeModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        points={level?.point}
        conversionRate={conversionRate}
        userId={session?.user?.id}
        onExchangeAdd={onExchangeAdd}
        setLoading={setLoading}
        loading={loading}
      />
      <NotificationModal
        isOpen={notificationModalIsOpen}
        onRequestClose={closeNotificationModal}
        message={notificationMessage}
      />

      <RedeemSuccessModal
        isOpen={successModal}
        onRequestClose={closeSuccessModal}
        redeemItem={selectedRedeem}
      />

      {redeemModalIsOpen && (
        <Modal open={redeemModalIsOpen} onClose={closeRedeemModal}>
          <div className="flex flex-col items-center text-center justify-center">
            <Image
              src={selectedRedeem.image}
              width={300}
              height={300}
              alt={selectedRedeem.name}
              style={{ width: "300px", height: "auto", objectFit: "contain" }}
            />
            <h2 className="text-xl font-bold text-[#0056FF]">
              {selectedRedeem.name}
            </h2>
            <p className="text-sm text-gray-600">
              {selectedRedeem.description}
            </p>
            <div className="flex flex-row justify-center items-center gap-2">
              <span className="text-sm font-bold">คงเหลือ</span>
              <span className="text-md font-bold text-red-500">
                {selectedRedeem.stock}
              </span>
              <span className="text-sm">ชิ้น</span>
            </div>
            <div className="flex justify-center items-center mt-4">
              <span className="text-sm font-bold">Coins:</span>
              <span className="ml-2 text-lg text-[#0056FF] font-bold">
                {selectedRedeem.coins}
              </span>
              <Image
                src="/images/profile/Coin.svg"
                alt="coins"
                width={15}
                height={15}
                className="ml-2"
              />
            </div>
            {selectedRedeem.point > 0 ? (
              <div className="mt-2">
                <span className="text-sm font-bold">Points:</span>
                <span className="ml-2 text-lg text-[#0056FF] font-bold">
                  {selectedRedeem.point}
                </span>
              </div>
            ) : (
              ""
            )}

            <div>
              <button
                className="w-full bg-[#F68B1F] text-white font-bold py-2 px-4 rounded-full mt-4"
                onClick={
                  selectedRedeem.stock <= 0
                    ? closeRedeemModal
                    : () => handleRedeemClick(selectedRedeem)
                }
                desable={selectedRedeem.stock <= 0 ? true : false}
              >
                {selectedRedeem.stock <= 0 ? "สินค้าหมดแล้ว" : "แลกของรางวัล"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Content */}
      <div className="flex flex-col p-4 gap-2 mb-20">
        {activeTab === "redeem" && (
          <Suspense fallback={<LoadingFeed />}>
            {redeems?.map((group, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-bold">{group.group}</span>

                <div className="flex flex-col gap-2 mt-1">
                  {group?.redeems?.map((redeemItem) => (
                    <div
                      key={redeemItem._id}
                      className="grid grid-cols-3 w-full bg-gray-300 rounded-xl cursor-pointer"
                      onClick={() => openRedeemModal(redeemItem)}
                    >
                      <div className="flex flex-col col-span-1 items-center justify-center">
                        <Image
                          src={redeemItem.image}
                          alt={redeemItem.name}
                          width={150}
                          height={150}
                          className="flex p-2 rounded-xl"
                          style={{
                            minWidth: "150px",
                            maxHeight: "120px",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <div className="flex flex-col col-span-2 justify-between flex-grow p-2">
                        <div>
                          <div className="text-sm font-bold text-[#0056FF]">
                            {redeemItem.name}
                          </div>
                          <div>
                            <span className="text-xs line-clamp-2">
                              {redeemItem.description}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex-col text-left">
                            <span className="text-[0.7em]">คงเหลือ</span>
                            <span className="flex font-bold mt-[-5px]">
                              {redeemItem.stock} สิทธิ์
                            </span>
                          </div>
                          <button className="bg-[#F68B1F] rounded-full text-white font-bold h-8 px-4">
                            redeem
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Divider className="mt-4 mb-2" />
              </div>
            ))}
          </Suspense>
        )}

        {activeTab === "redeemtrans" && (
          <Suspense fallback={<LoadingFeed />}>
            {redeemTransData?.map((transItem) => (
              <div
                key={transItem._id}
                className="flex flex-row w-full bg-gray-300 rounded-xl p-1"
              >
                <Image
                  src={transItem?.redeemId?.image}
                  alt={transItem?.redeemId?.name}
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
                        {moment(transItem?.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="flex text-lg font-bold text-[#0056FF]">
                      {transItem?.redeemId?.name}
                    </div>
                    <div>
                      <span className="text-[12px] line-clamp-2">
                        {transItem?.redeemId?.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex text-left">
                      <span className="text-[0.7em] font-bold">
                        {transItem?.status}
                      </span>
                    </div>

                    {transItem?.redeemId?.coins > 0 && (
                      <div className="text-left">
                        <span className="text-[0.7em] font-bold">Coins</span>
                        <span className="font-bold ml-1 text-[#0056FF]">
                          {transItem?.coins}
                        </span>
                      </div>
                    )}
                    {transItem?.redeemId?.points > 0 && (
                      <div className="text-left ml-2">
                        <span className="text-[0.7em]">Points</span>
                        <span className="font-bold ml-1">
                          {transItem?.redeemId?.points}
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
