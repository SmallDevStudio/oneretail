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

    const handleExport = async () => {
        setLoading(true);
    
        try {
            const formattedData = selectedAnswer.answers.map((item) => ({
                empId: item.user?.empId || "-",
                name: item.user?.fullname || "-",
                answerCount: item?.userAnswers?.length,
                createdAt: moment(item.createdAt).format("LLL"),
            }));
    
            // Prepare Sheet Data
            const sheetData = selectedAnswer.answers.map((answer) => {
                const firstUserAnswer = answer.userAnswers[0]; // ดึงคำตอบแรกของผู้ใช้
                const correctCount = firstUserAnswer?.answers?.filter((ans) => ans.isCorrect).length || 0;
                const incorrectCount = firstUserAnswer?.answers?.length - correctCount || 0;
    
                return {
                    empId: answer.user?.empId || "-",
                    fullname: answer.user?.fullname || "-",
                    correct: correctCount,
                    incorrect: incorrectCount,
                    total: firstUserAnswer?.answers?.length || 0,
                    createdAt: firstUserAnswer
                        ? moment(firstUserAnswer.createdAt).format("YYYY-MM-DD HH:mm")
                        : "-",
                };
            });
    
            // Prepare Summary by Quiz
            const firstAnswers = selectedAnswer.answers.map((answer) => answer.userAnswers[0]); // ดึงคำตอบแรกของผู้ใช้
            const questionSummary = firstAnswers.flatMap((ua) =>
                ua?.answers.map((a) => ({
                    questionId: a.questionId,
                    question: a.question?.question || "-",
                    isCorrect: a.isCorrect,
                }))
            );
    
            const summaryByQuiz = [...new Map(questionSummary.map((item) => [item.questionId, item])).values()].map(
                (question) => {
                    const relatedAnswers = questionSummary.filter(
                        (q) => q.questionId === question.questionId
                    );
                    const correctCount = relatedAnswers.filter((q) => q.isCorrect).length;
                    const totalCount = relatedAnswers.length;
                    const incorrectCount = totalCount - correctCount;
                    const correctPercentage = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : "0.00";
    
                    return {
                        index: selectedAnswer.answers.findIndex((a) => a.questionId === question.questionId) + 1,
                        question: question.question,
                        correct: correctCount,
                        incorrect: incorrectCount,
                        correctPercentage: `${correctPercentage}%`,
                    };
                }
            );
    
            // Create Workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const dataSheet = XLSX.utils.json_to_sheet(sheetData);
            const summarySheet = XLSX.utils.json_to_sheet(summaryByQuiz);
    
            // Add Worksheets
            XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
            XLSX.utils.book_append_sheet(workbook, dataSheet, "Sheet Data");
            XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary by Quiz");
    
            // Export to Excel
            XLSX.writeFile(workbook, `ExamAnswer_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
            setLoading(false);
        } catch (error) {
            console.error("Error exporting data:", error);
            setLoading(false);
        }
    };
    


    console.log('selectedAnswer.answers',selectedAnswer.answers);
    console.log('answers',answers);

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
                        <div className="flex flex-row justify-between w-full">
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-[#0056FF]">{selectedAnswer.title}</span>
                                <span className="text-sm text-gray-500">{selectedAnswer.description}</span>
                            </div>
                            <button
                                className="bg-[#0056FF] text-white px-4 py-2 rounded-lg"
                                onClick={handleExport}
                            >
                                รายงาน
                            </button>
                        </div>

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
                                    {openDetails && selectedUserDetails === answer.userAnswers && (
                                        <div key={answer?.id}>
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