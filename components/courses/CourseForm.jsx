import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPlusSquareFill } from "react-icons/bs";
import { FaPlusSquare, FaEdit } from "react-icons/fa";
import { FaSquareMinus } from "react-icons/fa6";
import { Divider } from '@mui/material';
import Swal from 'sweetalert2';

const CourseForm = ({ userId, mutate, isEditing, editData, setIsEditing, handleShowForm, setSelectedCourse }) => {
    const [courses, setCourses] = useState({});
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [showQuestions, setShowQuestions] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        if (isEditing && editData) {
            setCourses({
                title: editData?.course?.title,
                description: editData?.course?.description,
                category: editData?.course?.category,
                group: editData?.course?.group,
                active: editData?.course?.active ? true : false,
                driveUrl: editData?.course?.driveUrl
            });
            setQuestions(editData.questions);
        }
    }, [isEditing, editData]);

    const handleOpenQuestions = () => {
        setShowQuestions(!showQuestions);
    };

    const handleOptionChange = (optionIndex, value) => {
        const newOptions = [...options];
        newOptions[optionIndex] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveOption = (optionIndex) => {
        const newOptions = options.filter((_, index) => index !== optionIndex);
        setOptions(newOptions);
    };

    const handleSaveQuestion = async () => {
        if (!question.trim()) {
            alert("กรุณากรอกคำถาม");
            return;
        }
        if (options.some(option => !option.trim())) {
            alert("กรุณากรอกตัวเลือกทั้งหมด");
            return;
        }
    
        const newQuestion = {
            question,
            description,
            options,
        };
    
        if (editIndex !== null) {
            // Update existing question
            setQuestions(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[editIndex] = newQuestion;
                return updatedQuestions;
            });
            await axios.put(`/api/courses/questions/${questions[editIndex]._id}`, newQuestion);
            setEditIndex(null); // Reset edit index
            mutate();
        } else {
            // Add new question
            setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
            try {
                const response = await axios.post('/api/courses/questions', newQuestion);
                mutate();
            } catch (error) {
                console.error('Error adding question:', error);
            }
        }
    
        handleClearQuestion();
        setShowQuestions(false);
    };

    const handleClearQuestion = () => {
        setQuestion('');
        setDescription('');
        setOptions(['', '', '', '']);
        setEditIndex(null); // Clear edit index
        setShowQuestions(false);
    };
    
    const handleEditQuestion = (index) => {
        const questionToEdit = questions[index];
        setQuestion(questionToEdit.question);
        setDescription(questionToEdit.description);
        setOptions(questionToEdit.options);
        setEditIndex(index); // Set edit index
        setShowQuestions(true);
    };

    const handleRemoveQuestion = async(questionIndex) => {
        setQuestions(prevQuestions => prevQuestions.filter((_, index) => index !== questionIndex));
        await axios.delete(`/api/courses/questions/${questions[questionIndex]._id}`);
        mutate();
    };

    const handleAddCourse = async () => {
        if (courses.title.trim() === "") {
            alert("กรุณากรอกชื่อหลักสูตร");
            return;
        }

        try {
            if (isEditing) {
                const UpdateCourseData = {
                    title: courses.title,
                    description: courses.description,
                    category: courses.category,
                    group: courses.group,
                    active: courses.active,
                    questions: questions.map((q) => ({
                        _id: q._id || undefined, // Include _id for existing questions
                        question: q.question,
                        description: q.description,
                        options: q.options,
                    })),
                    driveUrl: courses.driveUrl, // Ensure this matches back-end naming
                    creator: userId
                };

                console.log('UpdateCourseData:', UpdateCourseData);

                await axios.put(`/api/courses/${editData?.course?._id}`, UpdateCourseData);
                Swal.fire({
                    icon: "success",
                    title: "แก้ไขหลักสูตรสำเร็จ",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                const courseData = {
                    title: courses.title,
                    description: courses.description,
                    category: courses.category,
                    group: courses.group,
                    active: courses.active,
                    questions: questions,
                    driveUrl: courses.driveUrl,
                    creator: userId
                };

                await axios.post("/api/courses", courseData);
                Swal.fire({
                    icon: "success",
                    title: "เพิ่มหลักสูตรสำเร็จ",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
    
            setCourses({});
            setQuestions([]);
            setSelectedCourse(null);
            setIsEditing(false);
            handleShowForm();
            mutate();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error.message,
                showConfirmButton: true,
            });
        }
    };

    const handleCancel = () => {
        setCourses({});
        setQuestions([]);
        setQuestion('');
        setDescription('');
        setOptions(['', '', '', '']);
        handleShowForm();
        setSelectedCourse(null);
        setIsEditing(false);
    };

    return (
        <div className='flex flex-col w-full px-5'>
            <span className='text-2xl font-bold'>เพิ่มหลักสูตร</span>

            <div className='flex flex-col gap-2 mt-2 w-full'>
                <div className='flex flex-row items-center gap-2 w-full'>
                    <label htmlFor="title">
                        <span className='text-sm font-bold'>ชื่อหลักสูตร:<span className='text-red-500'>*</span></span>
                    </label>
                    <input 
                        className='w-1/2 h-10 rounded-xl bg-slate-200 px-2' 
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder='ชื่อหลักสูตร'
                        value={courses.title || ''}
                        onChange={(e) => setCourses({ ...courses, title: e.target.value })}
                        required 
                    />
                </div>

                <div className='flex flex-row items-center gap-2 w-full'>
                    <label htmlFor="description">
                        <span className='text-sm font-bold'>คําอธิบาย:</span>
                    </label>    
                    <textarea 
                        className='w-1/2 h-20 rounded-xl bg-slate-200 px-2' 
                        id="description" 
                        name="description" 
                        placeholder='คําอธิบาย'
                        value={courses.description || ''}
                        onChange={(e) => setCourses({ ...courses, description: e.target.value })}
                        required 
                    />
                </div>

                <div className='flex flex-row gap-2 w-full'>
                    <div className='flex flex-row items-center gap-2 w-full'>
                        <span className='text-sm font-bold'>หมวดหมู่:</span>
                        <input
                            className='w-1/2 h-10 rounded-xl bg-slate-200 px-2'
                            type="text"
                            id="category"
                            name="category"
                            placeholder='หมวดหมู่'
                            value={courses.category || ''}
                            onChange={(e) => setCourses({ ...courses, category: e.target.value })}
                        />
                    </div>

                    <div className='flex flex-row items-center gap-2 w-full'>
                        <span className='text-sm font-bold'>กลุ่ม:</span>
                        <input
                            className='w-1/2 h-10 rounded-xl bg-slate-200 px-2'
                            type="text"
                            id="group"
                            name="group"
                            placeholder='กลุ่ม'
                            value={courses.group || ''}
                            onChange={(e) => setCourses({ ...courses, group: e.target.value })}
                        />
                    </div>

                    <div className='flex flex-row items-center gap-2 w-full'>
                        <span className='text-sm font-bold'>Active:</span>
                        <select
                            className='w-1/2 h-10 rounded-xl bg-slate-200 px-2'
                            id="active"
                            name="active"
                            defaultValue={true}
                            value={courses.active}
                            onChange={(e) => setCourses({ ...courses, active: e.target.value })}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className='flex flex-row items-center gap-2 w-full'>
                    <span className='text-sm font-bold'>googleDrive:</span>
                    <input
                        className='w-1/2 h-10 rounded-xl bg-slate-200 px-2'
                        type="text"
                        id="driveUrl"
                        name="driveUrl"
                        placeholder='กรอกลิ้ง Google Drive'
                        value={courses.driveUrl || ''}
                        onChange={(e) => setCourses({ ...courses, driveUrl: e.target.value })}
                    />
                </div>

                <Divider
                    orientation="horizontal"
                    variant="middle"
                    flexItem
                    textAlign='left'
                >
                    <div className='flex flex-row items-center gap-2'>
                        <span className='text-sm font-bold'>คำถาม</span>
                        <span className='text-[#0056FF]' onClick={handleOpenQuestions}>
                            {showQuestions ? <FaSquareMinus size={20} /> : <FaPlusSquare size={20} />}
                        </span>
                    </div>
                </Divider>

                {questions.map((q, questionIndex) => (
                    <div key={questionIndex} className='flex flex-row items-center gap-2 w-full'>
                        <span className='text-sm font-bold'>{questionIndex + 1}.</span>
                        <span className='text-sm font-bold'>{q.question}</span>
                        <FaEdit
                            className='text-[#F68B1F]' 
                            size={20}
                            onClick={() => handleEditQuestion(questionIndex)}
                        />
                        <FaSquareMinus 
                            className='text-[#FF0000]' 
                            size={20}
                            onClick={() => handleRemoveQuestion(questionIndex)}
                        />
                    </div>
                ))}

                {showQuestions && (
                    <div className='flex flex-col gap-2 border border-gray-300 rounded-lg p-4'>
                        <div className='flex flex-row items-center gap-2'>
                            <label htmlFor={`question`}>
                                <span className='text-sm font-bold'>คําถาม:<span className='text-red-500'>*</span></span>
                            </label>
                            <input 
                                className='w-1/2 h-10 rounded-lg bg-slate-200 px-2' 
                                type="text" 
                                id={`question`} 
                                name={`question`} 
                                placeholder='คําถาม' 
                                value={question || ''}
                                onChange={(e) => setQuestion(e.target.value)}
                                required 
                            />
                        </div>
                        <div className='flex flex-row items-center gap-2 w-full'>
                            <label htmlFor={`description`}>
                                <span className='text-sm font-bold'>คําอธิบาย:</span>
                            </label>
                            <textarea 
                                className='w-1/2 h-20 rounded-lg bg-slate-200 px-2' 
                                id={`description`} 
                                name={`description`} 
                                placeholder='คําอธิบาย'
                                rows={4}
                                value={description || ''}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-row items-center gap-2 w-full'>
                            <span className='text-sm font-bold'>เพิ่มตัวเลือก</span>
                            <BsPlusSquareFill 
                                className='text-[#0056FF]' 
                                size={25}
                                onClick={handleAddOption}
                            />
                        </div>
                        {options.map((option, optionIndex) => (
                            <div key={optionIndex} className='flex flex-row items-center gap-2 w-full'>
                                <span className='text-sm font-bold'>{optionIndex + 1}.</span>
                                <input
                                    className='w-1/2 h-10 rounded-lg bg-slate-200 px-2' 
                                    type="text" 
                                    placeholder='กรอกตัวเลือก' 
                                    value={option || ''}
                                    onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                />
                                <FaSquareMinus 
                                    className='text-[#FF0000]' 
                                    size={20}
                                    onClick={() => handleRemoveOption(optionIndex)}
                                />
                            </div>
                        ))}
                        <div className='flex flex-row items-center gap-2 mt-2 w-full'>
                            <button
                                className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full text-sm"
                                onClick={handleSaveQuestion}
                            >
                                บันทึกคำถาม
                            </button>
                            <button
                                className="bg-[#FF0000] text-white font-bold py-2 px-4 rounded-full text-sm"
                                onClick={handleClearQuestion}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!showQuestions && (
                <div className='flex flex-row items-center gap-2 mt-4 w-full'>
                    <button
                        className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full text-sm"
                        onClick={handleAddCourse}
                    >
                        บันทึกหลักสูตร
                    </button>

                    <button
                        className="bg-[#FF0000] text-white font-bold py-2 px-4 rounded-full text-sm"
                        onClick={handleCancel}
                    >
                        ยกเลิก
                    </button>
                </div>
            )}
        </div>
    );
}

export default CourseForm;
