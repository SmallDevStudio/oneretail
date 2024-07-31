import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LuInfo } from "react-icons/lu";
import { IoMdArrowRoundForward } from "react-icons/io";

const LineProgressBar = dynamic(() => import("@/components/ProfileLineProgressBar"), { ssr: false });

const UserPanel = ({user, level}) => {
    const percent = level?.nextLevelRequiredPoints
        ? parseFloat((level?.totalPoints / level?.nextLevelRequiredPoints ) * 100)
        : 0;

    return (
        <div className="flex flex-row bg-[#0056FF] text-white rounded-xl px-2">
            <div className="flex flex-col">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col" style={{ width: "auto", height: "auto" }} onClick={() => setIsModalOpen(true)}>
                        <div className="items-center text-center" style={{ width: "auto", height: "90px" }}>
                            <div className="mt-4 ml-4">
                                <Image
                                    src={level?.user?.pictureUrl}
                                    alt="User Avatar"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                    loading="lazy"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
                                />
                            </div>
                            <div className="absolute top-0 mt-5 z-0">
                                <Image
                                    src="/images/profile/Badge.svg"
                                    alt="Badge"
                                    width={90}
                                    height={90}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start text-lg font-bold mt-5 px-2 leading-6">
                        <span>{level?.user?.fullname}</span>
                        <span>Level: {level?.level}</span>
                    </div>
                </div>
                <div className="flex flex-col mb-2">
                    <div className="flex flex-row items-center gap-1 text-xs justify-end">
                        <span>{level?.totalPoints} / {level?.nextLevelRequiredPoints}</span>
                        <LuInfo />
                    </div>
                    <LineProgressBar percent={percent} />
                    <span className="text-xs font-medium mt-3">
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
                            {level?.totalPoints}
                        </span>
                        <span>
                            คะแนน
                        </span>
                    </div>

                    <div className="flex flex-col items-center mt-3">
                        <span className="text-xs">
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
                            >
                                คลิก
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default UserPanel;