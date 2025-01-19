import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { Divider } from "@mui/material";
import { FaSquarePlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Loading from "../Loading";

export default function ExaminationsForm({ handleCloseForm, isEditExamination, mutate }) {
    const [examination, setExamination] = useState({});
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isEditQuestion, setIsEditQuestion] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (isEditExamination) {
            setExamination({
                id: isEditExamination._id,
                title: isEditExamination.title,
                description: isEditExamination.description,
                group: isEditExamination.group,
                position: isEditExamination.position,  
            })
            setQuestions(isEditExamination.questions);
            setIsEdit(true);
        }
    }, [isEditExamination]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmitQuestion = () => {
        if (question.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อผิดพลาด',
                text: 'กรุณากรอกคำถาม',
            });
            return;
        }
    
        if (options.some((option) => option.trim() === '')) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อผิดพลาด',
                text: 'กรุณากรอกตัวเลือกคำตอบให้ครบ',
            });
            return;
        }
    
        if (isEditQuestion) {
            const updatedQuestions = questions.map((q, index) => {
                if (index === questionIndex) {
                    return {
                        ...q,
                        question: question,
                        options: options,
                        correctAnswer: correctAnswer,
                    };
                }
                return q;
            });
    
            setQuestions(updatedQuestions);
            setIsEditQuestion(false);
        } else {
            const newQuestion = { 
                _id: null, // ใช้ null สำหรับคำถามใหม่
                question: question, 
                options: options, 
                correctAnswer: correctAnswer,
            };
            setQuestions([...questions, newQuestion]);
        }
    
        handleClearQuestion();
    };

    const handleClearQuestion = () => {
        setQuestion(''); // Clear the question input field
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setShowQuestionForm(false);
    };

    const handleAddQuestion = () => {
        setQuestionIndex(questionIndex + 1);
        setQuestion(''); // Clear the question input field
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        showQuestionForm ? setShowQuestionForm(false) : setShowQuestionForm(true);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleEditQuestion = (index) => {
        const question = questions[index];
        setQuestion(question.question);
        setOptions(question.options);
        setCorrectAnswer(question.correctAnswer);
        setQuestionIndex(index);
        setIsEditQuestion(true);
        !showQuestionForm ? setShowQuestionForm(true) : handleClearQuestion();
    };

    const handleSubmitExamination = async () => {
        if (examination.title === '' || examination.title === undefined) {
            setError({
                title: 'กรุณากรอกชื่อข้อสอบ',
            });
            return;
        }

        if (isEdit) {
            const data = {
                title: examination.title,
                description: examination.description? examination.description : null,
                group: examination.group? examination.group : null,
                position: examination.position? examination.position : null,
                questions: questions.map((question) => ({
                    _id: question._id ? question._id : null,
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                })),
                creator: session.user.id,
            };

            try {
                setLoading(true);
                const response = await axios.put(`/api/examinations2/${examination.id}`, data);
                console.log(response.data);
                const result = await Swal.fire({
                    icon: 'success',
                    title: 'สําเร็จ',
                    text: 'แก้ไขข้อสอบสําเร็จ',
                    confirmButtonText: 'OK',
                });
                if (result.isConfirmed) {
                    handleClearExamination();
                    handleCloseForm();
                    mutate();
                }
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                    confirmButtonText: 'OK',
                })
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            const data = {
                title: examination.title,
                description: examination.description? examination.description : null,
                group: examination.group? examination.group : null,
                position: examination.position? examination.position : null,
                questions: questions,
                creator: session.user.id,
            };
    
            try {
                setLoading(true);
                const response = await axios.post('/api/examinations2', data);
                console.log(response.data);
                const result = await Swal.fire({
                    icon: 'success',
                    title: 'สําเร็จ',
                    text: 'เพิ่มข้อสอบสําเร็จ',
                    confirmButtonText: 'OK',
                });
                if (result.isConfirmed) {
                    handleClearExamination();
                    handleCloseForm();
                }
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.response.data.message,
                    confirmButtonText: 'OK',
                })
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleClearExamination = () => {
        setExamination({}); // Clear the examination object
        setQuestions([]); // Clear the questions array
        setQuestion(''); // Clear the question input field
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setQuestionIndex(0);
        setShowQuestionForm(false);
        setLoading(false);
        setError({});
        setIsEdit(false);
        handleCloseForm();
    };
    

    return (
        <div className="flex flex-col w-full">
            <span className="text-md font-bold text-[#0056FF]">{isEdit ? 'แก้ไขข้อสอบ' : 'เพิ่มข้อสอบ'}</span>
            <div className="flex flex-col w-full gap-2 text-sm">
                <div className="flex flex-row items-center gap-2 w-full">
                    <label 
                        htmlFor="title"
                        className="col-span-1 text-md font-bold"
                    >
                        ชื่อข้อสอบ<span className="text-red-500">*</span>:
                    </label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title"
                        className={`flex border rounded-full p-2 w-1/2 ${error.title ? "border-red-500" : "border-gray-300"}`}
                        value={examination.title} 
                        onChange={(e) => setExamination({...examination, title: e.target.value})}
                        placeholder="กรอกชื่อข้อสอบ"
                    />
                    {error.title && <span className="text-red-500">{error.title}</span>}
                </div>

                <div className="flex flex-row items-center gap-2 w-full">
                    <label 
                        htmlFor="description"
                        className="col-span-1 text-md font-bold"
                    >
                        รายละเอียด:
                    </label>
                    <input 
                        type="text" 
                        name="description" 
                        id="description"
                        className="flex border border-gray-300 rounded-full p-2 w-1/2"
                        value={examination.description} 
                        onChange={(e) => setExamination({...examination, description: e.target.value})}
                        placeholder="กรอกรายละเอียดข้อสอบ"
                    />
                </div>

                <div className="flex flex-row items-center gap-2 w-full">
                    <div className="flex flex-row items-center gap-2 w-1/2">
                        <label 
                            htmlFor="group"
                            className="col-span-1 text-md font-bold"
                        >
                            กลุ่ม:
                        </label>
                        <input 
                            type="text" 
                            name="group" 
                            id="group"
                            className="flex border border-gray-300 rounded-full p-2 w-1/2"
                            value={examination.group} 
                            onChange={(e) => setExamination({...examination, group: e.target.value})}
                            placeholder="กรอกกลุ่มข้อสอบ"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2 w-1/2">
                        <label 
                            htmlFor="position"
                            className="col-span-1 text-md font-bold"
                        >
                            กลุ่ม:
                        </label>
                        <input 
                            type="text" 
                            name="position" 
                            id="position"
                            className="flex border border-gray-300 rounded-full p-2 w-1/2"
                            value={examination.position} 
                            onChange={(e) => setExamination({...examination, position: e.target.value})}
                            placeholder="กรอกกลุ่มข้อสอบ"
                        />
                    </div>
                </div>

                <Divider className="w-full my-2" style={{ borderColor: 'gray' }} textAlign="left" flexItem>
                    <div 
                        className="flex flex-row items-center gap-2"
                        onClick={handleAddQuestion}
                    >
                        <FaSquarePlus size={20} className="text-[#0056FF]"/>
                        <span className="text-md font-bold">ข้อสอบ</span>
                    </div>
                </Divider>
                {/* Questions */}
                <div className="flex flex-col w-full gap-2">
                    {questions ? 
                    questions.map((question, index) => (
                        <div className="flex flex-row items-center gap-2" key={index}>
                            <span className="flex w-5">{index + 1}.</span>
                            <span className="flex min-w-60">{question.question}</span>
                            <div className="col-span-2 flex flex-row items-center gap-2">
                                <div 
                                    className="flex bg-[#0056FF] px-2 py-1 text-white rounded-full cursor-pointer"
                                    onClick={() => handleEditQuestion(index)}
                                >
                                    <FaRegEdit size={12}/>
                                </div>
                                <div 
                                    className="flex bg-red-500 px-2 py-1 text-white rounded-full cursor-pointer"
                                    onClick={() => handleDeleteQuestion(index)}
                                >
                                    <RiDeleteBin5Line size={12}/>
                                </div>
                            </div>  
                        </div>
                    ))
                    : null
                    }
                </div>

                {showQuestionForm && (
                    <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <label 
                            htmlFor="question"
                            className="col-span-1 text-md font-bold"
                        >
                            คำถาม:
                        </label>
                        <input 
                            type="text" 
                            name="question" 
                            id="question"
                            className="flex border border-gray-300 rounded-full p-2 w-1/2"
                            value={question} 
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="กรอกคําถาม"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full">
                        {options.map((option, index) => (
                            <div className="flex flex-row items-center gap-2 w-full" key={index}>
                                <label 
                                    htmlFor={`option-${index}`}
                                    className="col-span-1 text-md font-bold"
                                >
                                    คําตอบ {index + 1}:
                                </label>
                                <input 
                                    type="text" 
                                    name={`option-${index}`} 
                                    id={`option-${index}`}
                                    className="flex border border-gray-300 rounded-full p-2 w-5/6"
                                    value={option} 
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`กรอกคําตอบ ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-row items-center gap-2 w-full">
                        <label 
                            htmlFor="correctAnswer"
                            className="col-span-1 text-md font-bold"
                        >
                            คําตอบถูกต้อง:
                        </label>
                        <select 
                            name="correctAnswer" 
                            id="correctAnswer"
                            className="flex border border-gray-300 rounded-full p-2 w-1/2"
                            value={correctAnswer} 
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                        >
                            {options.map((option, index) => 
                                option !== '' ? (
                                    <option key={index} value={index}>
                                        คําตอบ {index + 1} - {option}
                                    </option>
                                ) : null
                            )}
                        </select>
                    </div>

                    <div className="flex flex-row items-center text-sm gap-2 w-full">
                        <button
                            className="bg-blue-500 text-white font-bold py-2 px-4 text-sm rounded-full"
                            onClick={handleSubmitQuestion}
                        >
                            {isEditQuestion? 'แก้ไข' : 'บันทึกคำถาม'}
                        </button>

                        <button
                            className="bg-red-500 text-white font-bold py-2 px-4 text-sm rounded-full"
                            onClick={handleClearQuestion}
                        >
                            ลบคําถาม
                        </button>
                    </div>

                </div>
                )}

                <div className="flex flex-row items-center justify-center gap-2 w-full mt-4">
                    <button
                        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full ${showQuestionForm ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSubmitExamination}
                        disabled={showQuestionForm}
                    >
                        {isEdit? 'แก้ไข' : 'บันทึก'}
                    </button>

                    <button
                        className={`bg-red-500 text-white font-bold py-2 px-4 rounded-full ${showQuestionForm ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleClearExamination}
                        disabled={showQuestionForm}
                    >

                        ยกเลิก
                    </button>
                </div>

            </div>

        </div>
    )
}