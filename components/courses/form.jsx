import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { IoIosArrowBack } from "react-icons/io";
import { FaWpforms } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { Divider } from '@mui/material';
import Loading from "@/components/Loading";
import { Alert, Slide } from "@mui/material";
import Swal from "sweetalert2";

export default function Form({ course, handleCloseForm }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [suggestions, setSuggestions] = useState('');
    const [points, setPoints] = useState([]);
    const [anonymous, setAnonymous] = useState(false);
    const [rating, setRating] = useState(0);

    const router = useRouter();
    const { data: session } = useSession();

    const handleClear = () => {
        setAnswers([]);
        setSuggestions('');
        setPoints([]);
        setRating(0);
        setAnonymous(false);
        handleCloseForm();
    };
        
    const handleAddReview = async () => {
        setError(null); // รีเซ็ตข้อผิดพลาดก่อน
        setLoading(true);
        
        try {
            // ตรวจสอบว่าผู้ใช้ตอบครบทุกคำถามหรือไม่
            if (answers.length < course.questions.length || answers.some(answer => !answer)) {
                setError("กรุณาตอบคำถามให้ครบทุกข้อ");
                setLoading(false);
                return;
            }
        
            // คำนวณคะแนนเฉลี่ยและเก็บไว้ใน `rating` (เป็นเลขจำนวนเต็ม)
            const totalPoints = points.reduce((sum, point) => sum + point, 0);
            const maxPoints = course.questions.length * 5; // คะแนนสูงสุดที่เป็นไปได้
            const calculatedRating = parseFloat(((totalPoints / maxPoints) * 5).toFixed(2)); // แปลงคะแนนให้เป็นค่าเต็ม 5 และปัดเป็นทศนิยม 2 ตำแหน่ง
            setRating(calculatedRating);
        
            // สร้างข้อมูลรีวิว
            const reviewData = {
                userId: session.user.id,
                courseId: course._id,
                question: answers,
                suggestion: suggestions,
                anonymous: anonymous,
                rating: calculatedRating,
            };
        
            await axios.post('/api/questionnaires', reviewData);

            // รีเซ็ตสถานะเมื่อเสร็จสิ้น
            setLoading(false);
            setError(null);
            handleClear();
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการส่งแบบสอบถาม กรุณาลองใหม่อีกครั้ง");
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        loading ? <Loading /> : (
            <>
            <div className="flex flex-col w-full mt-2 mb-10">
                
                {/* Header */}
                <div className="flex flex-row items-center">
                    <IoIosArrowBack 
                        className="text-xl inline text-gray-700"
                        onClick={handleClear}
                        size={30}
                    />
                    <FaWpforms size={20} className="text-[#0056FF] ml-4" />
                    <h1 className="text-2xl font-bold text-[#0056FF] ml-2">แบบประเมิน</h1>
                </div>

                {error && 
                 <Slide 
                    direction="down" 
                    in={error !== null} 
                    mountOnEnter 
                    unmountOnExit
                >
                    <div className="fixed top-0 left-0 right-0 z-50">
                        <Alert 
                            variant="filled"
                            severity="warning"
                            onClose={handleCloseError}
                        >
                            {error}
                        </Alert>
                    </div>
                </Slide>
                }

                {/* Body */}
                <div className="flex flex-col w-full px-4 mt-2">
                    {course?.questions?.map((question, index) => (
                        <div key={index} className="flex flex-col w-full mt-2">
                            <span className="text-lg font-bold">{index + 1}. {question.question}</span>
                            <div>
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex flex-row items-center">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            onChange={(e) => {
                                                const newAnswers = [...answers];
                                                newAnswers[index] = {
                                                    questionId: question._id,
                                                    answer: option,
                                                };
                                                setAnswers(newAnswers);
                                                const newPoints = [...points];
                                                newPoints[index] = optionIndex;
                                                setPoints(newPoints);
                                            }}
                                        />
                                        <span className="ml-2">{option}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Divider className="my-4" />

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="checkbox"
                                id="anonymous"
                                checked={anonymous}
                                onChange={(e) => setAnonymous(e.target.checked)}
                            />
                            <label htmlFor="anonymous" className="text-lg font-bold">
                                ไม่แสดงตัวตน
                            </label>
                        </div>
                        <label htmlFor="suggestions" className="text-lg font-bold">
                            ข้อเสนอแนะ
                        </label>
                        <textarea 
                            name="suggestions" 
                            id="suggestions"
                            rows="4" 
                            placeholder="กรุณากรอกข้อเสนอแนะ"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={suggestions}
                            onChange={(e) => setSuggestions(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row justify-center gap-4 mt-4">
                        <button
                            className="bg-[#0056FF] text-white px-4 py-2 rounded-full"
                            onClick={handleAddReview}
                        >
                            ส่งแบบสอบถาม
                        </button>
                        <button
                            className="bg-[#FF0000] text-white px-4 py-2 rounded-full"
                            onClick={handleClear}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div> 
            </>     
        )
    );

}