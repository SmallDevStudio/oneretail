import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { RiFileExcel2Fill } from "react-icons/ri";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

export default function Report({ event, onClose, mutate }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Header */}
            <div className="flex flex-row bg-[#0056FF] text-white items-center p-2 gap-4 w-full">
                <IoIosArrowBack size={30} onClick={onClose}/>
                <span className="text-2xl font-bold">Report: {event?.title}</span>
            </div>
            <div className="flex flex-row gap-2 px-4 w-full">
                <button
                    className="flex flex-row items-center gap-2 p-2 bg-green-500 font-bold text-white rounded-lg"
                >
                    <RiFileExcel2Fill size={20} />
                    Export
                </button>
            </div>
            {/* Detail Event */}
            <div className="flex flex-col text-md px-4 w-full mt-4">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-4">
                        <span className="font-bold">ชื่อกิจกรรม:</span>
                        <span className="">{event?.title}</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <span className="font-bold">รุ่นที่</span>
                        <span className="">{event?.No}</span>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <span className="font-bold">รายละเอียด:</span>
                    <span className="">{event?.description}</span>
                </div>

                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-4">
                        <span className="font-bold">Channel:</span>
                        <span className="">{event?.channel}</span>
                    </div>
                    <div className="flex flex-row gap-4">
                        <span className="font-bold">Position:</span>
                        <span className="">{event?.position}</span>
                    </div>
                </div>

                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-4">
                        <span className="font-bold">วันที่เริ่ม:</span>
                        <span className="">{moment(event?.startDate).format("LL")}</span>
                    </div>
                    <div className="flex flex-row gap-4">
                        <span className="font-bold">วันที่สิ้นสุด:</span>
                        <span className="">{moment(event?.endDate).format("LL")}</span>
                    </div>
                    <div className="flex flex-row gap-4">
                        <span className="font-bold">เวลา:</span>
                        <span className="">{event?.startTime} - {event?.endTime}</span>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <span className="font-bold">สถานที่:</span>
                    <span className="">{event?.place}</span>
                </div>
                <div className="flex flex-row gap-4">
                    <span className="font-bold">หมายเหตุ:</span>
                    <span className="">{event?.remark || "-"}</span>
                </div>
            </div>

            {/* Report */}
            <div>

            </div>
        </div>
    );
}
