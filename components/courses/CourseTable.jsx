import { useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import { BsPlusSquareFill } from "react-icons/bs";
import { FaPlusSquare, FaEdit } from "react-icons/fa";
import { FaSquareMinus } from "react-icons/fa6";
import { IoQrCodeSharp } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import Qrcode from "../forms/Qrcode";
import { Divider } from '@mui/material';
import Swal from 'sweetalert2';
import Modal from "./Modal";

moment.locale('th');

export default function CourseTable({ courses, mutate, setIsEditing, setSelectedCourse, selectedCourse, handleShowForm, handleShowReport }) {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openQrModal, setOpenQrModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');

    const handleDelete = async (id) => {
        const resolt = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณจะลบคอร์สนี้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });
        
        if (resolt.isConfirmed) {
            try {
                await axios.delete(`/api/courses/${id}`);
                mutate();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleUpdateActive = async (id, active) => {

        try {
            await axios.put(`/api/courses/active?id=${id}`, {
                active: active
            });
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateQuestionActive = async (id, active) => {

        try {
            await axios.put(`/api/courses/questionactive?id=${id}`, {
                active: active
            });
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsEditing(true);
        handleShowForm();
    };

    const handleOpenModal = (questions) => {
        setSelectedQuestions(questions);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedQuestions([]);
        setOpenModal(false);
    };

    const handleOpenQrModal = (course) => {
        const url = `${window.location.origin}/courses/suggestions/${course._id}`;
        setSelectedCourseId(course._id);
        setText(course?.title);
        setUrl(url);
        setOpenQrModal(true);
    };

    const handleCloseQrModal = () => {
        setSelectedCourseId(null);
        setText('');
        setUrl('');
        setOpenQrModal(false);
    };

    const handleReport = (course) => {
        setSelectedCourse(course);
        handleShowReport();
    };

    console.log('selectedQuestions:', selectedQuestions);

    return (
        <div>
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-[#FF9800]/50">
                        <th className="px-4 py-2 w-20">ลําดับ</th>
                        <th className="px-4 py-2">ชื่อคอร์ส</th>
                        <th className="px-4 py-2">คําอธิบาย</th>
                        <th className="px-4 py-2 w-20">คำถาม</th>
                        <th className="px-4 py-2 w-40">สถานะ</th>
                        <th className="px-4 py-2 w-40">เปิด/ปิดแบบสอบถาม</th>
                        <th className="px-4 py-2 w-[12%]">วันที่สร้าง</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{course?.course?.title}</td>
                            <td className="border px-4 py-2">{course?.course?.description}</td>
                            <td className="border px-4 py-2">
                                <div 
                                    className="flex items-center justify-center w-full cursor-pointer"
                                    onClick={() => handleOpenModal(course.questions)}
                                >
                                    <span className="bg-blue-500 font-bold text-white px-4 py-0.5 rounded-full">
                                        {Array.isArray(course.questions) ? course.questions.length : 0}
                                    </span>
                                </div>
                            </td>
                            <td className="border px-4 py-2 w-32">
                                <div 
                                    className="flex items-center justify-center w-full cursor-pointer"
                                    onClick={() => handleUpdateActive(course?.course?._id, !course?.course?.active)}
                                >
                                {course?.course?.active ? 
                                <span className="bg-green-500 font-bold text-white px-4 py-0.5 rounded-full">เปิดใช้งาน</span> 
                                : 
                                <span className="bg-red-500 font-bold text-white px-4 py-0.5 rounded-full">ปิดใช้งาน</span>
                                }
                                </div>
                            </td>
                            <td className="border px-4 py-2 w-32">
                                <div 
                                    className="flex items-center justify-center text-sm w-full cursor-pointer"
                                    onClick={() => handleUpdateQuestionActive(course?.course?._id, !course?.course?.questionnairesActive)}
                                >
                                    {course?.course?.questionnairesActive ? 
                                    <span className="bg-green-500 font-bold text-white px-4 py-0.5 rounded-full">เปิดใช้งาน</span> 
                                    : 
                                    <span className="bg-red-500 font-bold text-white px-4 py-0.5 rounded-full">ปิดใช้งาน</span>
                                    }
                                </div>
                            </td>
                            <td className="border px-4 py-2">{moment(course?.course?.createdAt).format('lll')}</td>
                            <td className="border px-4 py-2">
                                <div className="flex items-center space-x-2">
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit 
                                            onClick={() => handleEdit(course)} 
                                            size={25}
                                        />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaSquareMinus 
                                            onClick={() => handleDelete(course?.course?._id)} 
                                            size={25}
                                        />
                                    </button>
                                    <IoQrCodeSharp size={25} onClick={() => handleOpenQrModal(course?.course)}/>
                                    <TbReportAnalytics size={25} onClick={() => handleReport(course?.course)}/>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {openModal && (
                <Modal
                    open={openModal}
                    onClose={() => handleCloseModal()}
                >
                    <div>
                        <span className="font-bold text-[#0056FF] text-xl">คำถาม</span>
                        {selectedQuestions.map((question, index) => (
                            <div key={index} className="p-2">
                                <span className="font-bold"><span>{index + 1}. </span>{question.question}</span>
                                <div>
                                    {question.options.map((option, index) => (
                                        <div key={index}>
                                            <li>
                                                {option}
                                            </li>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
            {openQrModal && (
                <Qrcode
                    url={url}
                    open={openQrModal}
                    onClose={handleCloseQrModal}
                    text={text}
                />
            )}
        </div>
    );
}