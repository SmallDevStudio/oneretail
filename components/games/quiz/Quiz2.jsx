import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Quiz2 = () => {
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [group, setGroup] = useState('');
    const [subGroup, setSubGroup] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [amount, setAmount] = useState(0);

    // เพิ่ม page และ limit
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState('');

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`/api/quiz?page=${page}&limit=${limit}`);
            setQuestions(response.data.data);
            setTotalPages(Math.ceil(response.data.total / limit));
            setAmount(response.data.amount);
        } catch (error) {
            console.error(error);
        }
    };

    // เรียก fetchQuestions ใหม่เมื่อ page หรือ limit เปลี่ยนแปลง
    useEffect(() => {
        fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);


    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1); // รีเซ็ตหน้าเป็น 1 เมื่อเปลี่ยน limit
    };

    // ฟังก์ชันการกรองข้อมูล
    const filterQuestions = () => {
        return questions.filter((q) =>
            q.question.toLowerCase().includes(filter.toLowerCase()) ||
            q.group.toLowerCase().includes(filter.toLowerCase()) ||
            q.subGroup.toLowerCase().includes(filter.toLowerCase())
        );
    };

    const handleChangeOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddQuestion = async () => {
        setShowForm(true);
        setEditMode(false);
        setLoading(true);

        const newQuestion = {
            question,
            options,
            correctAnswer,
            group,
            subGroup,
        };

        try {
            const response = await axios.post('/api/quiz', newQuestion);

            if (response.data) {
                setQuestion('');
                setOptions(['', '', '', '']);
                setCorrectAnswer(0);
                setGroup('');
                setSubGroup('');
                fetchQuestions();
                Swal.fire({
                    icon: 'success',
                    title: 'เพิ่มคําถามสําเร็จ',
                    text: 'คุณได้เพิ่มคําถามเรียบร้อยแล้ว',
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เพิ่มคําถามไม่สําเร็จ',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'เพิ่มคําถามไม่สําเร็จ',
                text: 'กรุณาลองใหม่อีกครั้ง',
            });
        } 

        setLoading(false);
        setShowForm(false);
    };

    const handleClearForm = () => {
        setQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setGroup('');
        setSubGroup('');
        setShowForm(false);
    };

    const handleShowForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleDeleteQuestion = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this question? This process cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/quiz/${id}`);

                if (response.data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Your question has been deleted.',
                    });
                    fetchQuestions();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        }
    };

    const handleEditQuestion = (index) => {
        const question = questions[index];
        setSelectedQuestion(index);
        setQuestion(question.question);
        setOptions(question.options);
        setCorrectAnswer(question.correctAnswer);
        setGroup(question.group);
        setSubGroup(question.subGroup);
        setEditMode(true);
        setShowForm(true);
    };

    const handleUpdateQuestion = async (id) => {
        setLoading(true);
        try {
            const updatedQuestion = {
                question,
                options,
                correctAnswer,
                group,
                subGroup,
            };

            const response = await axios.put(`/api/quiz/${id}`, updatedQuestion);
            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขคำถามสําเร็จ',
                    text: 'คุณได้แก้ไขคำถามเรียบร้อยแล้ว',
                });
                fetchQuestions();
                handleClearForm();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'แก้ไขคำถามไม่สําเร็จ',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'แก้ไขคำถามไม่สําเร็จ',
                text: 'กรุณาลองใหม่อีกครั้ง',
            });
        } 

        setEditMode(false);
        setLoading(false);
        handleClearForm();
    };


    return (
        <div className="flex flex-col w-full">
            {/* Tools */}
            <div className="flex flex-row justify-between items-center gap-2 mb-2">
                <button
                    className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full text-lg"
                    onClick={handleShowForm}
                >
                    เพิ่มคําถาม
                </button>

                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="filter" className="font-bold">ค้นหา</label>
                    <input
                        type="text"
                        id="filter"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder='ค้นหาคำถาม'
                    />
                </div>
            </div>

            {/* Table */}
            <div>
                <table className="table-auto w-full text-xs">
                    <thead className="bg-[#FF9800]/50">
                        <tr>
                            <th className="border px-4 py-2">ลำดับ</th>
                            <th className="border px-4 py-2">คําถาม</th>
                            <th className="border px-4 py-2">ตัวเลือก</th>
                            <th className="border px-4 py-2">คําตอบที่ถูก</th>
                            <th className="border px-4 py-2">กลุ่ม</th>
                            <th className="border px-4 py-2">หมวดหมู่</th>
                            <th className="border px-4 py-2">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterQuestions().map((question, index) => (
                            <tr key={index} className="text-center">
                                <td className="border px-4 py-2">
                                    {(page - 1) * limit + index + 1}
                                </td>
                                <td className="border px-4 py-2">{question.question}</td>
                                <td className="border px-4 py-2">{question.options.join(',')}</td>
                                <td className="border px-4 py-2">{question.correctAnswer}</td>
                                <td className="border px-4 py-2">{question.group}</td>
                                <td className="border px-4 py-2">{question.subGroup}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-[#0056FF] text-white font-bold px-4 py-1 rounded-full"
                                        onClick={() => handleEditQuestion(index)}
                                    >
                                        แก้ไข
                                    </button>
                                    <button
                                        className="bg-red-500 text-white font-bold px-4 py-1 rounded-full ml-2"
                                        onClick={() => handleDeleteQuestion(question._id)}
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-row items-center gap-2">
                        <button
                            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-400' : 'bg-[#0056FF] text-white'}`}
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                        >
                            ก่อนหน้า
                        </button>

                        <button
                            className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-400' : 'bg-[#0056FF] text-white'}`}
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                        >
                            ถัดไป
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <span>หน้า {page} จาก {totalPages}</span>
                        <span>ข้อมูลทั้งหมด {amount}</span>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="limit">แสดงผล</label>
                        <select
                            name="limit"
                            id="limit"
                            value={limit}
                            onChange={handleLimitChange}
                            className="border px-2 py-1 rounded-lg"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Modal for Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
                        <h1 className="text-xl font-bold text-[#0056FF] mb-4">
                            {editMode ? "แก้ไขคำถาม" : "เพิ่มคําถาม"}
                        </h1>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-2 w-full">
                                <label htmlFor="question" className='text-lg font-bold'>คำถาม</label>
                                <input 
                                    type="text" 
                                    placeholder="คําถาม"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className='border-2 border-gray-300 rounded-lg p-2 w-full'
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="options" className='text-lg font-bold'>ตัวเลือก</label>
                                    {options.map((option, index) => (
                                        <input 
                                            key={index} 
                                            type="text" 
                                            placeholder={`ตัวเลือกที่ ${index + 1}`}
                                            value={option}
                                            onChange={(e) => handleChangeOption(index, e.target.value)}
                                            className='border-2 border-gray-300 rounded-lg p-2 w-1/2'
                                        />
                                    ))}
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label htmlFor="correctAnswer" className='text-lg font-bold'>คำถามที่ถูกต้อง</label>
                                <select 
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                                    className='border-2 border-gray-300 rounded-lg p-2'
                                >
                                    {options.map((option, index) => (
                                        <option key={index} value={index}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label htmlFor="group" className='text-lg font-bold'>กลุ่ม</label>
                                <input 
                                    type="text" 
                                    placeholder="กลุ่ม"
                                    value={group}
                                    onChange={(e) => setGroup(e.target.value)}
                                    className='border-2 border-gray-300 rounded-lg p-2'
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label htmlFor="subGroup" className='text-lg font-bold'>กลุ่มย่อย</label>
                                    <input 
                                        type="text" 
                                        placeholder="กลุ่มย่อย"
                                        value={subGroup}
                                        onChange={(e) => setSubGroup(e.target.value)}
                                        className='border-2 border-gray-300 rounded-lg p-2'
                                    />
                            </div>
                            <div className="flex justify-center gap-2">
                                <button
                                    className='bg-[#0056FF] text-white font-bold py-2 px-4 rounded-lg'
                                    onClick={!editMode ? handleAddQuestion : () => handleUpdateQuestion(questions[selectedQuestion]._id)}
                                >
                                    {loading ? "กําลังบันทึก..." : editMode ? "แก้ไข" : "เพิ่มคําถาม"}
                                </button>
                                <button
                                    className='bg-red-500 text-white font-bold py-2 px-4 rounded-lg'
                                    onClick={handleCloseForm}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz2;
