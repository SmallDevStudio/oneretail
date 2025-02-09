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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

moment.locale('th');

export default function AnswerTable({ answers }) {
    const [openAnswerModal, setOpenAnswerModal] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [exportAnswers, setExportAnswers] = useState([]);

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (selectedAnswer && selectedAnswer.createdAt) {
          setStartDate(new Date(selectedAnswer.createdAt));
          setEndDate(new Date());
        }
    }, [selectedAnswer]);

    useEffect(() => {
        setLoading(true);
        if (selectedAnswer && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // กรองข้อมูลตามวันที่ (ถ้ามีการระบุ startDate และ endDate)
            const filteredAnswers = selectedAnswer.answers.filter((answer) => {
                const created = new Date(answer.createdAt);
                return created >= start && created <= end;
            })
            setExportAnswers(filteredAnswers);
            setLoading(false);
        } else {
            setExportAnswers(selectedAnswer);
            setLoading(false);
        }
    }, [endDate, selectedAnswer, startDate]);

    // ฟังก์ชัน validate สำหรับ startDate เมื่อมีการเปลี่ยนแปลง
  const handleStartDateChange = (date) => {
    const examCreatedAt = new Date(selectedAnswer.createdAt);
    const today = new Date();

    if (date < examCreatedAt) {
      Swal.fire("Error", "Start Date ต้องไม่น้อยกว่า วันที่สร้างข้อสอบ", "error");
      return;
    }
    if (date > today) {
      Swal.fire("Error", "Start Date ต้องไม่มากกว่าวันปัจจุบัน", "error");
      return;
    }
    if (endDate && date > endDate) {
      Swal.fire("Error", "Start Date ต้องไม่มากกว่า End Date", "error");
      return;
    }
    setStartDate(date);
  };

  // ฟังก์ชัน validate สำหรับ endDate เมื่อมีการเปลี่ยนแปลง
  const handleEndDateChange = (date) => {
    const examCreatedAt = new Date(selectedAnswer.createdAt);
    const today = new Date();

    if (date < examCreatedAt) {
      Swal.fire("Error", "End Date ต้องไม่น้อยกว่า วันที่สร้างข้อสอบ", "error");
      return;
    }
    if (date > today) {
      Swal.fire("Error", "End Date ต้องไม่มากกว่าวันปัจจุบัน", "error");
      return;
    }
    if (startDate && date < startDate) {
      Swal.fire("Error", "End Date ต้องไม่ต่ำกว่า Start Date", "error");
      return;
    }
    setEndDate(date);
  };

    if (!answers) return <Loading />;

    const handleOpenAnswerModal = (answer) => {
        setSelectedAnswer(answer);
        setOpenAnswerModal(true);
    }

    const handleCloseAnswerModal = () => {
        setSelectedAnswer(null);
        setOpenAnswerModal(false);
        setStartDate('');
        setEndDate('');
    }

    const handleOpenDetails = (details) => {
        setSelectedUserDetails(details);
        setOpenDetails(!openDetails);
    }


    const handleExport = async () => {
        setLoading(true);

        try {
            // Prepare formatted data สำหรับ Sheet "Summary"
            const formattedData = exportAnswers.map((item) => ({
                empId: item.user?.empId || "-",
                name: item.user?.fullname || "-",
                teamGroup: item?.user?.emp?.teamGrop || "-",
                position: item?.user?.emp?.position || "-",
                answerCount: item?.userAnswers?.length,
                createdAt: moment(item.createdAt).format("LLL"),
            }));
        
            // Prepare Sheet Data: ใช้เฉพาะคำตอบแรกของผู้ใช้แต่ละคน
            const sheetData = exportAnswers.map((answer) => {
                const firstUserAnswer = answer.userAnswers[0]; // ดึงคำตอบแรกของผู้ใช้
                const correctCount = firstUserAnswer?.answers?.filter((ans) => ans.isCorrect).length || 0;
                const incorrectCount = firstUserAnswer?.answers?.length - correctCount || 0;
        
                return {
                    empId: answer.user?.empId || "-",
                    fullname: answer.user?.fullname || "-",
                    teamGroup: answer?.user?.emp?.teamGrop || "-",
                    position: answer?.user?.emp?.position || "-",
                    correct: correctCount,
                    incorrect: incorrectCount,
                    total: firstUserAnswer?.answers?.length || 0,
                    createdAt: firstUserAnswer
                        ? moment(firstUserAnswer.createdAt).format("YYYY-MM-DD HH:mm")
                        : "-",
                };
            });
        
            // Prepare Summary by Quiz: ใช้เฉพาะคำตอบแรกของผู้ใช้แต่ละคนในการคำนวณ
            const firstAnswers = exportAnswers.map((answer) => answer.userAnswers[0]);
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
                        (q) => String(q.questionId) === String(question.questionId)
                    );
                    const correctCount = relatedAnswers.filter((q) => q.isCorrect).length;
                    const totalCount = relatedAnswers.length;
                    const incorrectCount = totalCount - correctCount;
                    const correctPercentage = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : "0.00";
        
                    // หากต้องการ index จากข้อมูลที่ถูกกรอง ให้ใช้ exportAnswers (หรือ firstAnswers) ในการหา index
                    const index = firstAnswers.findIndex(
                        (a) => String(a.questionId) === String(question.questionId)
                    ) + 1;
        
                    return {
                        index, // ลำดับ 1-based
                        question: question.question,
                        correct: correctCount,
                        incorrect: incorrectCount,
                        correctPercentage: `${correctPercentage}%`,
                    };
                }
            );
        
            // สร้าง Workbook และเพิ่ม Sheet ต่างๆ
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const dataSheet = XLSX.utils.json_to_sheet(sheetData);
            const summarySheet = XLSX.utils.json_to_sheet(summaryByQuiz);
        
            XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
            XLSX.utils.book_append_sheet(workbook, dataSheet, "Sheet Data");
            XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary by Quiz");
        
            // Export เป็นไฟล์ Excel
            XLSX.writeFile(workbook, `ExamAnswer_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
            setLoading(false);
        } catch (error) {
            console.error("Error exporting data:", error);
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col w-full">
            <span className="flex self-end text-sm text-red-500 font-bold">(คลิกที่ช่องเพื่อดูรายละเอียด และส่งออกไฟล์)</span>
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
                            className="hover:bg-[#0056FF] hover:text-white cursor-pointer"
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
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex flex-row justify-between gap-2">
                            <div>
                                <span className="font-bold">จำนวนคำตอบ: <span className="text-[#0056FF]">{exportAnswers?.length}</span></span>
                            </div>
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-row items-center gap-2">
                                    <label className="text-sm font-bold" htmlFor="startDate">
                                        วันที่เริ่มต้น:
                                    </label>
                                    <DatePicker
                                        id="startDate"
                                        selected={startDate} // ใช้ selected แทน value
                                        onChange={(date) => handleStartDateChange(date)} // รับค่า date โดยตรง
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <label className="text-sm font-bold" htmlFor="endDate">
                                        วันที่สิ้นสุด:
                                    </label>
                                    <DatePicker
                                        id="endDate"
                                        selected={endDate}
                                        onChange={(date) => handleEndDateChange(date)}
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <button
                                    className="bg-[#0056FF] text-white px-4 py-2 rounded-lg"
                                    onClick={handleExport}
                                    >
                                รายงาน
                                </button>
                            </div>
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
                                {exportAnswers && Array.from(exportAnswers).map((answer, index) => (
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