import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "../utils/Avatar";
import moment from "moment";
import "moment/locale/th";
import Modal from "./Modal";
import * as XLSX from "xlsx";

moment.locale('th');

export default function Report({ course }) {
    const [report, setReport] = useState({});
    const [selectedData, setSelectedData] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (course._id) {
            const fetchCourseData = async () => {
                try {
                    const response = await axios.get(`/api/courses/report?id=${course._id}`);
                    setReport(response.data.data);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchCourseData();
        }
    }, [course._id]);

    const hendleOpen = (answer, user, date) => {
        setSelectedData({answer, user, date});
        setOpen(!open);
    }

    const handleClose = () => {
        setSelectedData(null);
        setOpen(false);
    }

    const handleExport = async () => {
        setLoading(true);
        try {
            const formattedData = report?.questionnaires?.map((item) => ({
                empId: item?.user?.empId || "-",
                name: item?.user?.fullname || "-",
                suggestion: item?.suggestion || "-",
                point: item?.rating || "-",
                createdAt: moment(item.createdAt).format("LLL"),
            }));

            const questionAnswers = report?.questionnaires?.flatMap(q => q.question) || [];
        
            // Group คำตอบตาม questionId
            const groupByQuestionId = {};
            questionAnswers.forEach((qa) => {
                const key = qa.questionId.toString();
                if (!groupByQuestionId[key]) {
                    groupByQuestionId[key] = [];
                }
                // ตรวจสอบให้แน่ใจว่า qa.point เป็นตัวเลข
                if (typeof qa.point === "number") {
                    groupByQuestionId[key].push(qa.point);
                }
            });

            // สร้าง array สำหรับ sheet "Questions"
            const questionsSheetData = Object.keys(groupByQuestionId).map((key, index) => {
                const points = groupByQuestionId[key];
                const avg = points.reduce((sum, val) => sum + val, 0) / (points.length || 1);
                // ดึงข้อความคำถามจาก qa ตัวแรกที่ตรงกับ questionId นั้น
                const questionText = questionAnswers.find(
                    (qa) => qa.questionId.toString() === key
                )?.questionData?.question || "-";
                return {
                    index: index + 1,
                    question: questionText,
                    averageRating: avg.toFixed(2)
                };
            });

            // สร้าง Workbook และเพิ่ม Sheet ต่างๆ
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const questionsWorksheet = XLSX.utils.json_to_sheet(questionsSheetData);
                    
            XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
            XLSX.utils.book_append_sheet(workbook, questionsWorksheet, "Questions");
                    
            // Export เป็นไฟล์ Excel
            XLSX.writeFile(workbook, `CourseReviews_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
            setLoading(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-full">
            <span className="text-xl font-bold">{course.title}</span>
            <div className="flex flex-row justify-end mt-2">
                <button
                    className="bg-[#0056FF] text-white px-4 py-2 rounded-md"
                    onClick={handleExport}
                >
                    Export
                </button>
            </div>
            <div>
                <table className="table-auto w-full text-sm mt-4">
                    <thead>
                        <tr className="bg-gray-100 border">
                            <th className="border px-4 py-2 w-10">ลำดับ</th>
                            <th className="border px-4 py-2">พนักงาน</th>
                            <th className="border px-4 py-2">คำถาม</th>
                            <th className="border px-4 py-2">คำแนะนำ</th>
                            <th className="border px-4 py-2">คะแนน</th>
                            <th className="border px-4 py-2">วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                    {report?.questionnaires?.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2 text-center">{index + 1}</td>
                            <td className="border px-4 py-2">
                                <div className="flex items-center">
                                    <Avatar src={item?.user?.pictureUrl} size={30} userId={item?.user?._id} />
                                    <div className="ml-2">
                                        <span className="font-bold">{item?.user?.fullname}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="border px-4 py-2 text-center">
                                <div className="cursor-pointer font-bold" onClick={() => hendleOpen(item?.question, item?.user ,item?.createdAt)}>
                                    คลิกรายละเอียด
                                </div>
                            </td>
                            <td className="border px-4 py-2">{item?.suggestion}</td>
                            <td className="border px-4 py-2 text-center">{item?.rating}</td>
                            <td className="border px-4 py-2">{moment(item?.createdAt).format('LLL')}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
            </div>
            {selectedData && open && 
                <Modal 
                    isOpen={open} 
                    onClose={handleClose} 
                >   
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col text-sm gap-2">
                            <span><strong>รหัสพนักงาน:</strong> {selectedData?.user?.empId}</span>
                            <span><strong>พนักงาน:</strong> {selectedData?.user?.fullname}</span>
                            <span><strong>วันที่:</strong> {moment(selectedData?.date).format('LLL')}</span>
                        </div>
                        <table className="table-auto w-full text-sm mt-4">
                            <thead>
                                <tr className="bg-gray-100 border">
                                    <th className="border px-4 py-2 w-10">ลำดับ</th>
                                    <th className="border px-4 py-2">คำถาม</th>
                                    <th className="border px-4 py-2">คำตอบ</th>
                                    <th className="border px-4 py-2">คะแนน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedData?.answer?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2">{item?.questionData?.question}</td>
                                        <td className="border px-4 py-2">{item?.answer}</td>
                                        <td className="border px-4 py-2 text-center">{item?.point}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            }
        </div>
    );
}