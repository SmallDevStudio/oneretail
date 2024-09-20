import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LuInfo } from "react-icons/lu";
import { IoMdArrowRoundForward } from "react-icons/io";
import ExchangeModal from "@/components/ExchangeModal";
import LevelModal from "@/components/LevelModal";

const LineProgressBar = dynamic(() => import("@/components/ProfileLineProgressBar"), { ssr: false });

const UserPanel = ({user, level, onExchangeAdd, setLoading, loading, coins}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [IsLevelModal, setIsLevelModal] = useState(false);
    const [conversionRate, setConversionRate] = useState(25);
    const percent = level?.nextLevelRequiredPoints
        ? parseFloat((level?.totalPoints / level?.nextLevelRequiredPoints ) * 100)
        : 0;

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const openLevelModal = () => setIsLevelModal(true);
    const closeLevelModal = () => setIsLevelModal(false);

    return (
        <div className="flex flex-row bg-[#0056FF] text-white items-start justify-between rounded-xl px-2 shadow-lg">
            <div className="flex flex-col w-2/3">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col" style={{ width: "auto", height: "auto" }} onClick={() => setIsModalOpen(true)}>
                        <div className="items-center text-center" style={{ width: "auto", height: "90px" }}>
                            <div className="mt-3">
                                <Image
                                    src={level?.user?.pictureUrl}
                                    alt="User Avatar"
                                    width={80}
                                    height={80}
                                    className="rounded-full"
                                    loading="lazy"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start text-lg font-bold mt-5 gap-1">
                        <span className="text-xs">{level?.user?.fullname}</span>
                        <span className="text-xs">Level: {level?.level + 1}</span>
                    </div>
                </div>
                <div className="flex flex-col mb-2">
                    <div className="flex flex-row items-center gap-1 text-xs justify-end">
                        <span>{level?.totalPoints} / {level?.nextLevelRequiredPoints}</span>
                        <LuInfo 
                            onClick={openLevelModal}
                        />
                    </div>
                    <LineProgressBar percent={percent} />
                    <span className="text-xs font-medium mt-6">
                        สะสมอีก {level?.nextLevelRequiredPoints - level?.totalPoints} คะแนน เพื่ออัปเดตระดับ
                    </span>
                </div>
            </div>

            <div className="flex flex-col text-xs px-1 mt-4">
                <div className="flex flex-col border-l-2 px-2 py-1">
                    <span className="flex font-bold mb-3">
                        คะแนนทั้งหมด
                    </span>
                    <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-[4em]">
                            {level?.point}
                        </span>
                        <span>
                            คะแนน
                        </span>
                    </div>
                    <span className="flex font-bold text-[#F2871F]">{coins.coins} คอยน์ </span>

                    <div className="flex flex-col items-center mt-3">
                        <span className="text-[10px]">
                            เปลี่ยนคะแนน เป็น คอยน์
                        </span>
                        <div className="flex flex-row items-center gap-2">
                        <Image
                            src="/images/profile/Point.svg"
                            alt="point"
                            width={30}
                            height={30}
                            priority
                            style={{ objectFit: "cover", 
                                objectPosition: "center", 
                                width: "15px", 
                                height: "15px" 
                            }}
                        />
                        <IoMdArrowRoundForward className="text-lg"/>
                        <Image
                            src="/images/profile/Coin.svg"
                            alt="coin"
                            width={32}
                            height={32}
                            style={{ objectFit: "cover", 
                                objectPosition: "center", 
                                width: "15px", 
                                height: "15px" 
                            }}
                        />
                            <button
                                className="text-[#F2871F] font-bold text-lg"
                                onClick={openModal}
                            >
                                คลิก
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
            <ExchangeModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                points={level?.point}
                conversionRate={conversionRate}
                userId={user?.user?.userId}
                onExchangeAdd={onExchangeAdd}
                setLoading={setLoading}
                loading={loading}
            />

            <LevelModal
                isOpen={IsLevelModal}
                onRequestClose={closeLevelModal}
            />
        </div>
    )
}

export default UserPanel;