import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { AppLayout } from "@/themes";
import Swal from "sweetalert2";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ExaminationsPage = () => {
    const [examAnswers, setExamAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]); // เก็บคำถามที่ตอบไม่ถูก
    const [loading, setLoading] = useState(false);
    const { data, error, isLoading } = useSWR("/api/examinations/", fetcher);
    const { data: session } = useSession();
    const router = useRouter();

    // Fetch user answers when the page loads
    useEffect(() => {
        const fetchUserAnswers = async () => {
            if (session?.user?.id) {
                try {
                    const res = await axios.get(`/api/examinations/answers?userId=${session.user.id}`);
                    const userAnswers = res.data.data;
    
                    if (userAnswers.length > 0) {
                        const latestUserAnswer = userAnswers[0]; // Assuming the most recent answers are first
    
                        console.log("All exam questions:", data.data);
                        console.log("User's latest answers:", latestUserAnswer);

                        if (latestUserAnswer.completed) {
                            console.log("All questions answered correctly, redirecting...");
                            router.push('/main');
                        } else {
                            // Filter out questions that have already been answered correctly
                            const incorrectQuestions = data.data.filter(exam =>
                                !latestUserAnswer.examId.includes(exam._id)
                            );
    
                            console.log("Incorrect questions to be answered:", incorrectQuestions);
                            setIncorrectAnswers(incorrectQuestions);
                        }
                    } else {
                        // If no answers have been recorded yet, show all questions
                        setIncorrectAnswers(data.data);
                    }
                } catch (error) {
                    console.error("Error fetching user answers:", error);
                    setIncorrectAnswers(data.data); // Fallback to showing all on error
                }
            }
        };
    
        if (data?.data && session?.user?.id) {
            fetchUserAnswers();
        }
    }, [data, session, router]);


    if (error) return <div>Failed to load</div>;
    if (isLoading || !data) return <Loading />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Construct the array of correct answers.
        const correctExamAnswers = data.data.map((exam) => {
            const userAnswer = examAnswers.find(answer => answer.questionId === exam._id);
            if (userAnswer && userAnswer.answer.toString() === exam.correctAnswer) {
                return exam._id; // Only pass ID to simplify the logic
            }
            return null;
        }).filter(Boolean);
    
        try {
            const response = await axios.get(`/api/examinations/answers?userId=${session?.user?.id}`);
            const userAnswerData = response.data.data.find(answer => answer.userId === session?.user?.id);
    
            let updatedExamIds = [];
            let newAnswerCount = 1; // Default to 1 if no previous data
    
            if (userAnswerData) {
                updatedExamIds = [...new Set([...userAnswerData.examId, ...correctExamAnswers])];
                newAnswerCount = userAnswerData.answerCount + 1;
            } else {
                updatedExamIds = [...new Set([...correctExamAnswers])];
            }
    
            const isCompleted = updatedExamIds.length === data.data.length;
    
            const updateOrPost = userAnswerData ? axios.put : axios.post;
            const url = userAnswerData ? `/api/examinations/answers` : `/api/examinations/answers`;
            const payload = userAnswerData ? {
                id: userAnswerData._id,
                examId: updatedExamIds,
                answerCount: newAnswerCount,
                completed: isCompleted,
            } : {
                userId: session?.user?.id,
                examId: updatedExamIds,
                answerCount: newAnswerCount,
                completed: isCompleted,
            };
    
            await updateOrPost(url, payload);
    
            await Swal.fire({
                icon: 'success',
                title: 'ยินดีด้วย!',
                text: `คุณตอบคำถามถูกต้อง ${correctExamAnswers.length} ข้อ`,
                confirmButtonText: 'ตกลง',
            });
    
            if (isCompleted) {
                router.push('/main');
            } else {
                router.reload();
            }
    
        } catch (error) {
            console.error("Error updating exam answers:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update your answers.',
                confirmButtonText: 'Try Again'
            });
        }
    
        setLoading(false);
    };

    return (
        <div className="flex flex-col w-full bg-[#0056FF] min-h-[100vh]">
            <div className="flex flex-col justify-center items-center pt-4 pb-4 w-full">
                <h1 className="flex text-2xl text-white font-bold">Examinations</h1>
            </div>

            <div className="flex flex-col justify-center items-center px-4 w-full">
                <div className="flex flex-col w-full bg-white text-sm rounded-xl p-2">
                {incorrectAnswers.map((examination, index) => {
                const realIndex = data.data.findIndex(exam => exam._id === examination._id); // หาลำดับจริงของข้อสอบ
                return (
                    <div key={index} className="flex flex-col w-full p-2">
                        <div className="flex mb-2 font-bold">
                            {realIndex + 1}. {examination.questions} {/* ใช้ realIndex แทน index */}
                        </div>
                        <div className="flex flex-col gap-2">
                            {examination.options.map((option, optIndex) => (
                                <div key={optIndex}
                                    className="flex flex-row p-1 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`option-${examination._id}`}
                                        value={optIndex}
                                        className="w-4 h-4"
                                        onChange={(e) => setExamAnswers((prev) => {
                                            const newAnswers = [...prev];
                                            const answerIndex = newAnswers.findIndex(a => a.questionId === examination._id);
                                            if (answerIndex >= 0) {
                                                newAnswers[answerIndex] = { questionId: examination._id, answer: optIndex };
                                            } else {
                                                newAnswers.push({ questionId: examination._id, answer: optIndex });
                                            }
                                            return newAnswers;
                                        })}
                                    />
                                        <label className="ml-2">{option}</label>
                                    </div>
                                    ))}
                                </div>
                        </div>
                    );
                 })}

                </div>
                <div className="flex mt-4 mb-20">
                    <button
                        className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full text-lg shadow-xl"
                        onClick={handleSubmit}
                    >
                        {loading ? "Loading..." : "ส่งคำตอบ"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExaminationsPage;

ExaminationsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
ExaminationsPage.auth = true;
