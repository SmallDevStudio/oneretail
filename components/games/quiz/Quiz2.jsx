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

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('/api/quiz');
            setQuestions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

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
        try {
            const response = await axios.delete(`/api/quiz/${id}`);

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'ลบคําถามสําเร็จ',
                    text: 'คุณได้ลบคําถามเรียบร้อยแล้ว',
                });
                fetchQuestions();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ลบคําถามไม่สําเร็จ',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'ลบคําถามไม่สําเร็จ',
                text: 'กรุณาลองใหม่อีกครั้ง',
            });
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
            <div className="flex flex-row gap-2 mb-2">
                <button
                    className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full text-lg"
                    onClick={!showForm? handleShowForm : handleCloseForm }
                >
                    {editMode ? 'แก้ไขคำถาม' : 'เพิ่มคําถาม'}
                </button>
            </div>

            {/* Table */}
            <div>
                <table className='table-auto w-full text-xs'>
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
                        {questions.map((question, index) => (
                            <tr key={index} className='text-center'>
                                <td className="border px-4 py-2">{index + 1}</td>
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
            </div>

            {/* Form */}
            {showForm && (
                <div className="flex flex-col gap-2 mt-5">
                <div>
                    <h1 className="text-xl font-bold text-[#0056FF]">เพิ่มคําถาม</h1>
                </div>
                <div className="flex flex-row items-center gap-2 w-1/2">
                    <label className="font-bold">
                        คําถาม <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="คําถาม"
                        name='question'
                        id='question'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        className='border-2 border-gray-300 rounded-lg p-1 w-1/2'
                    />
                </div>
                <div>
                    {/* Options */}
                    {options.map((option, index) => (
                        <div key={index} className="flex flex-row gap-2 items-center mt-2">
                            <label className="font-bold">
                                ตัวเลือกที่ {index + 1}
                            </label>
                            <input 
                                type="text" 
                                placeholder={`กรอกตัวเลือกที่ ${index + 1}`}
                                name='option'
                                value={option}
                                onChange={(e) => handleChangeOption(index, e.target.value)}
                                className='border-2 border-gray-300 rounded-lg p-1'
                            />
                        </div>
                    ))}
                </div>
                {/* Correct Answer */}
                <div className="flex flex-row gap-2 items-center">
                    <label className="font-bold">
                        ตัวเลือกที่ถูก
                    </label>
                    <select 
                        name="correctAnswer" 
                        id="correctAnswer"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className='border-2 border-gray-300 rounded-lg p-1 w-20'
                    >
                        {options.map((option, index) => (
                            <option 
                                key={index} 
                                value={index}
                            >
                                {option}
                            </option>
                        ))}
                        </select>
                </div>
                {/* Group */}
                <div className="flex flex-row gap-2 items-center">
                    <label className='font-bold'>
                        กลุ่ม
                    </label>
                    <input 
                        type="text" 
                        placeholder="กลุ่ม"
                        name='group'
                        id='group'
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        className='border-2 border-gray-300 rounded-lg p-1'
                    />
                </div>
                {/* SubGroup */}
                <div className="flex flex-row gap-2 items-center">
                    <label className='font-bold'>
                        กลุ่มย่อย
                    </label>
                    <input 
                        type="text" 
                        placeholder="กลุ่มย่อย"
                        name='subGroup'
                        id='subGroup'
                        value={subGroup}
                        onChange={(e) => setSubGroup(e.target.value)}
                        className='border-2 border-gray-300 rounded-lg p-1'
                    />
                </div>
                {/* Submit Button */}
                <div className="flex flex-row gap-2 items-center mt-5">
                    <button
                        className='bg-[#0056FF] hover:bg-[#0056FF]/90 text-white font-bold py-2 px-4 rounded-lg'
                        onClick={!editMode ? handleAddQuestion :() => handleUpdateQuestion(questions[selectedQuestion]._id)}
                    >
                        {loading ? "กําลังบันทึก..." : editMode ? "แก้ไข" : "เพิ่มคําถาม"}
                    </button>
                    <button
                        className='bg-red-500 hover:bg-red-500/90 text-white font-bold py-2 px-4 rounded-lg'
                        onClick={handleClearForm}
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
            )}
        </div>
    );
};

export default Quiz2;
