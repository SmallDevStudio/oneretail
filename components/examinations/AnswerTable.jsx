import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaSquarePlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Loading from "../Loading";
import Swal from "sweetalert2";
import Modal from "../Modal";
import moment from "moment";
import "moment/locale/th";
import * as XLSX from "xlsx";
import Image from "next/image";
import Avatar from "../utils/Avatar";

moment.locale('th');

export default function AnswerTable({ answers }) {
    const [openAnswerModal, setOpenAnswerModal] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    if (!answers) {
        setLoading(true);
    }

    const handleOpenAnswerModal = (answer) => {
        setSelectedAnswer(answer);
        setOpenAnswerModal(true);
    }

    const handleCloseAnswerModal = () => {
        setSelectedAnswer(null);
        setOpenAnswerModal(false);
    }

    const handleOpenDetails = (details) => {
        setSelectedUserDetails(details);
        setOpenDetails(!openDetails);
    }

    console.log(answers);
    return loading ? (
        <Loading />
    ) : (
        <div>
            <table className="table-auto w-full mt-2 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-center w-[100px]">สำดับ</th>
                        <th className="px-4 py-2 text-center">ข้อสอบ</th>
                        <th className="px-4 py-2 text-center">รายละเอียด</th>
                        <th className="px-4 py-2 text-center w-20">จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.map((answer, index) => (
                        <tr 
                            key={answer.id}
                            className="hover:bg-gray-100"
                            onClick={() => handleOpenAnswerModal(answer)}
                        >
                            <td className="border px-4 py-2 text-center">{index + 1}</td>
                            <td className="border px-4 py-2 text-left">{answer.title}</td>
                            <td className="border px-4 py-2 text-left">{answer.description}</td>
                            <td className="border px-4 py-2 text-center">{answer.userAnswerCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {openAnswerModal && (
                <Modal
                    open={openAnswerModal}
                    onClose={handleCloseAnswerModal}
                    title="ข้อสอบ"
                >
                    <div className="flex flex-col px-4 w-full">
                        <span className="font-bold text-lg text-[#0056FF]">{selectedAnswer.title}</span>
                        <span className="text-sm text-gray-500">{selectedAnswer.description}</span>

                        <table className="table-auto w-full mt-2 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-center">สำดับ</th>
                                    <th className="px-4 py-2 text-center">ผู้ตอบ</th>
                                    <th className="px-4 py-2 text-center">จำนวน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedAnswer.answers.map((answer, index) => (
                                    <>
                                    <tr 
                                        key={answer?.id}
                                        className="hover:bg-gray-100"
                                        onClick={() => handleOpenDetails(answer.userAnswers)}
                                    >
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-left">
                                            <div className="flex flex-row items-center gap-4">
                                                <Avatar 
                                                    src={answer?.user?.pictureUrl}
                                                    size={30} 
                                                    userId={answer?.user?.userId}
                                                />
                                                <span className="text-sm font-bold">{answer?.user?.fullname}</span>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 text-center">{answer?.userAnswers?.length}</td>
                                    </tr>
                                    {openDetails && (
                                        <div>
                                            Details
                                        </div>
                                    )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

        </div>
    );
}