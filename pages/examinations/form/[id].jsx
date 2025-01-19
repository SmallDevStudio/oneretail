import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Loading from "@/components/Loading";
import { AppLayout } from "@/themes";

const fetcher = url => axios.get(url).then(res => res.data);

const ExaminationForm = () => {
    const [examination, setExamination] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [useAnswers, setUseAnswers] = useState({});
    const [incorrectQuestions, setIncorrectQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const { data: useAnswersData } = useSWR(() => userId ? `/api/examination-answers/${id}?userId=${userId}` : null, fetcher, {
        onSuccess: (data) => {
            setUseAnswers(data.data);
        },
    });

    const { data } = useSWR(() => id ? `/api/examinations2/${id}` : null, fetcher, {
        onSuccess: (data) => {
            setExamination(data.data);
            const savedQuestions = JSON.parse(sessionStorage.getItem("incorrectQuestions"));
            setIncorrectQuestions(savedQuestions || data.data.questions);
        },
    });

    useEffect(() => {
        // ตรวจสอบสถานะ isComplete และบันทึก incorrectQuestions
        if (useAnswers?.isComplete) {
            setHasCompleted(true);
            setIncorrectQuestions([]);
            sessionStorage.removeItem("incorrectQuestions");
        } else if (incorrectQuestions.length > 0) {
            sessionStorage.setItem("incorrectQuestions", JSON.stringify(incorrectQuestions));
        }
    }, [useAnswers?.isComplete, incorrectQuestions]);

    const handleOptionChange = (index, questionId) => {
        const updatedAnswers = [...answers];
        const question = examination.questions.find(q => q._id === questionId);
        const isCorrect = parseInt(question.correctAnswer) === parseInt(index);

        const existingAnswerIndex = updatedAnswers.findIndex(answer => answer.questionId === questionId);
        if (existingAnswerIndex > -1) {
            updatedAnswers[existingAnswerIndex] = { questionId, answer: index, isCorrect };
        } else {
            updatedAnswers.push({ questionId, answer: index, isCorrect });
        }

        setAnswers(updatedAnswers);
        sessionStorage.setItem("answers", JSON.stringify(updatedAnswers));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const unansweredQuestions = incorrectQuestions.filter(
            question => !answers.some(answer => answer.questionId === question._id)
        );

        if (unansweredQuestions.length > 0) {
            Swal.fire("กรุณาตอบคำถามให้ครบทุกข้อ", "", "warning");
            setLoading(false);
            return;
        }

        const incorrect = answers.filter(answer => !answer.isCorrect).map(answer => answer.questionId);
        const savePayload = {
            userId,
            answers: answers.map(({ questionId, answer, isCorrect }) => ({
                questionId,
                answer,
                isCorrect,
            })),
            isComplete: incorrect.length === 0,
        };

        try {
            await axios.post(`/api/examination-answers/${id}`, savePayload);

            if (incorrect.length === 0) {
                Swal.fire("สำเร็จ", "คุณตอบคำถามถูกทั้งหมดแล้ว!", "success");
                setHasCompleted(true);
                sessionStorage.removeItem("incorrectQuestions");
                sessionStorage.removeItem("answers");
            } else {
                Swal.fire("ลองอีกครั้ง", `คุณตอบถูก ${answers.length - incorrect.length} ข้อ`, "warning");
            }
        } catch (error) {
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
        } finally {
            const nextRoundQuestions = examination.questions.filter(q => incorrect.includes(q._id));
            setIncorrectQuestions(nextRoundQuestions);
            setAnswers([]);
            sessionStorage.setItem("incorrectQuestions", JSON.stringify(nextRoundQuestions));
            sessionStorage.removeItem("answers");
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedAnswers = JSON.parse(sessionStorage.getItem("answers"));
        if (savedAnswers) {
            setAnswers(savedAnswers);
        }
    }, []);

    if (!examination) return <Loading />;

    
    return (
        <div className="flex flex-col w-full pb-20 ">
            {/* Header */}
            <div className="flex flex-row justify-center items-center bg-[#0056FF] text-white p-3 w-full">
                <div>
                    <span className="text-xl font-bold">ข้อสอบ</span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col p-5 w-full">
                <span className="text-lg font-bold">{examination?.title}</span>
                <span className="text-sm text-gray-500">{examination?.description}</span>

                <div className="flex flex-col">
                {!hasCompleted ? (
                    incorrectQuestions.map((question, index) => {
                        const questionIndex = examination.questions.findIndex(q => q._id === question._id) + 1;
                        return (
                            <div key={index} className="flex flex-col my-2 text-sm">
                                <span>{questionIndex}. {question?.question}</span>
                                <div className="flex flex-col gap-1 mt-2">
                                {question?.options?.map((option, i) => (
                                    <div key={i} className="flex flex-row items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name={`option-${question._id}`} 
                                            value={option} 
                                            onChange={() => handleOptionChange(i, question._id)} 
                                            checked={answers.some(answer => answer.questionId === question._id && answer.answer === i)} 
                                        />
                                        <label>{option}</label>
                                    </div>
                                ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center my-4">
                        <span className="text-lg font-bold text-green-600">คุณได้ส่งคำตอบเรียบร้อยแล้ว</span>
                    </div>
                )}
                </div>

                <div className="flex flex-row justify-center gap-4 mt-5">
                    {hasCompleted ? (
                        <div className="flex flex-col gap-4">
                            <button
                                className="bg-[#0056FF] text-white p-2 rounded-xl"
                                onClick={() => router.push("/main")}
                            >
                                กลับหน้าแรก
                            </button>
                        </div>
                    ): (
                        <>
                            <button 
                                className="bg-[#0056FF] text-white p-2 rounded-xl"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "กำลังส่ง..." : "ส่งคำตอบ"}
                            </button>

                            <button 
                                className="bg-red-500 text-white p-2 rounded-xl"
                                onClick={() => router.push("/")}
                            >
                                ยกเลิก
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExaminationForm;

ExaminationForm.getLayout = (page) => <AppLayout>{page}</AppLayout>;
