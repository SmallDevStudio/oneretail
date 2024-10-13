import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Modal from "../Modal";
import { IoIosCloseCircle } from "react-icons/io";
import { Divider } from "@mui/material";
import { CircularProgress } from '@mui/material';
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const QuestionsForm = () => {
    const [question, setQuestion] = useState([]);
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState([]);
    const [group, setGroup] = useState('');
    const [position, setPosition] = useState('');
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState({});

    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data, error, isLoading, mutate } = useSWR('/api/personal/questions', fetcher);

    const handleOptionsChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    }

    const handleSubmit = async () => {
        if (isEdit) {
            const updateData = {
                id: selectedQuestion._id,
                question,
                options,
                correctAnswer,
                group,
                position,
                active,
            }

            try {
                setLoading(true);
                const response = await axios.put(`/api/personal/questions/${selectedQuestion._id}`, updateData);
                console.log(response.data);
                if (response.status === 200) {
                    setLoading(false);
                    mutate();
                    handleClear();
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถบันทึกข้อมูลได้',
                        text: response.data.message,
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                });
            }
        } else {
            const newData = {
                question,
                options,
                correctAnswer,
                group,
                position,
                active,
                creator: userId
            }
    
            try {
                setLoading(true);
                const response = await axios.post('/api/personal/questions', newData);
                console.log(response.data);
                if (response.status === 201) {
                    setLoading(false);
                    mutate();
                    handleClear();
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถบันทึกข้อมูลได้',
                        text: response.data.message,
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                });
            }
        }

    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'คุณต้องการลบคำถามนี้ใช่หรือไม่?',
            text: 'คำถามที่ลบจะไม่สามารถกู้คืนได้',
            showCancelButton: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/personal/questions/${id}`);
                if (response.status === 200) {
                    mutate();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถลบข้อมูลได้',
                        text: response.data.message,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                });
            }
        }
    }

    const handleEdit = (data) => {
        setQuestion(data.question);
        setOptions(data.options);
        setCorrectAnswer(data.correctAnswer);
        setGroup(data.group);
        setPosition(data.position);
        setActive(data.active);
        setIsEdit(true);
        setOpen(true);
        setSelectedQuestion(data);
    }

    const handleClear = () => {
        setQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer([]);
        setGroup('');
        setPosition('');
        setActive(true);
        setIsEdit(false);
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
        handleClear();
    }


    return (
        <div className="flex flex-col px-5 py-2">
            {/* Questions */}
            <div className="flex">
                <button
                    onClick={() => setOpen(true)}
                    className="bg-[#0056FF] text-white p-2 rounded-lg"
                >
                    <span className="font-bold">เพิ่มคำถาม</span>
                </button>
            </div>
            {/* Table */}
            <div>
                <table className="table-auto w-full mt-5 text-sm border border-slate-500">
                    <thead className="bg-[#FF9800]/50">
                        <tr>
                            <th className="border-y border-slate-500 p-2 w-20">ลําดับ</th>
                            <th className="border-y border-slate-500 p-2">คำถาม</th>
                            <th className="border-y border-slate-500 p-2">ตัวเลือก</th>
                            <th className="border-y border-slate-500 p-2">ตัวเลือกที่ถูกต้อง</th>
                            <th className="border-y border-slate-500 p-2">กลุ่ม</th>
                            <th className="border-y border-slate-500 p-2">ตําแหน่ง</th>
                            <th className="border-y border-slate-500 p-2 w-32">สถานะ</th>
                            <th className="border-y border-slate-500 p-2">วันที่สร้าง</th>
                            <th className="border-y border-slate-500 p-2">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <CircularProgress />
                                </td>
                            </tr>
                        ) : (
                            data && data.data.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-y border-slate-500 px-2 py-1 text-center">{index + 1}</td>
                                    <td className="border-y border-slate-500  px-2 py-1">{item.question}</td>
                                    <td className="border-y border-slate-500 px-2 py-1">
                                        {item.options.map((option, index) => (
                                            <li className="list-disc" key={index}>{option}</li>
                                        ))}
                                    </td>
                                    <td className="border-y border-slate-500 px-2 py-1">
                                        {item.options[item.correctAnswer]}
                                    </td>
                                    <td className="border-y border-slate-500 px-2 py-1 text-center">{item.group}</td>
                                    <td className="border-y border-slate-500 px-2 py-1 text-center">{item.position}</td>
                                    <td className="border-y border-slate-500 px-2 py-1">
                                        <div className={`text-center text-white font-bold px-2 py-1 rounded-md ${item.active ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {item.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                        </div>
                                    </td>
                                    <td className="border-y border-slate-500 px-2 py-1">
                                        {moment(item.createdAt).format('lll')}
                                    </td>
                                    <td className="border-y border-slate-500 px-2 py-1">
                                       <div className="flex items-center justify-center gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                                                onClick={() => handleEdit(item)}
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                ลบ
                                            </button>
                                       </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            ) : (
               open && (
                <Modal
                open={open}
                onClose={handleClose}
                title={isEdit ? 'แก้ไขคําถาม' : 'เพิ่มคําถาม'}
            >
                <div className="flex flex-col">
            <div>
                <span className="text-xl font-bold">
                    {isEdit ? 'แก้ไขคำถาม' : 'เพิ่มคำถาม'}
                </span>
            </div>
            <Divider className="mt-2 mb-2"/>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                    <label className="font-bold">คำถาม:<span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="question"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        placeholder="คำถาม"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
                <div>
                    <label className="font-bold">ตัวเลือก:<span className="text-red-500">*</span></label>
                    <div className="flex flex-col gap-2">
                        {options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    name="option"
                                    className="border border-gray-300 rounded-md px-2 py-1"
                                    placeholder={`ตัวเลือก ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionsChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label className="font-bold">ตัวเลือกที่ถูกต้อง: <span className="text-red-500">*</span></label>
                    <select 
                        name="correctAnswers" 
                        id=""
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                    >
                        <option value="">เลือกตัวเลือกที่ถูกต้อง</option>
                        {options.map((option, index) => (
                            <option key={index} value={index}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label className="font-bold">กลุ่ม:</label>
                    <input
                        type="text"
                        name="group"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        placeholder="กลุ่ม"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label className="font-bold">ตําแหน่ง:</label>
                    <input
                        type="text"
                        name="position"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        placeholder="ตําแหน่ง"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        className="bg-blue-500 text-white rounded-md px-4 py-2"
                        onClick={handleSubmit}
                    >
                        {loading ? 'กําลังบันทึก...' : isEdit ? 'แก้ไข' : 'บันทึก'}
                    </button>
                    <button
                        className="bg-red-500 text-white rounded-md px-4 py-2"
                        onClick={handleClear}
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
        </Modal>
            ))}
        </div>
    );
};

export default QuestionsForm;