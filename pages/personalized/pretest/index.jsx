import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { AppLayout } from "@/themes";
import Swal from "sweetalert2";
import Divider from '@mui/material/Divider';
import { IoIosArrowBack } from "react-icons/io";

const fetcher = url => axios.get(url).then(res => res.data);

const Pretest = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showIncorrectAnswers, setShowIncorrectAnswers] = useState(false);
    const [optionSelected, setOptionSelected] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [submitted, setSubmitted] = useState(true);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const { data , error: questionsError, isLoading } = useSWR(`/api/personal/questions`, fetcher,{
        onSuccess: (data) => {
            setQuestions(data.data);
        },
    });

    if (questionsError) return <div>Error loading data</div>;
    if (isLoading || !data || questions.length === 0) return <Loading />;

    const handleAnswer = () => {
        setSubmitted(false);
        const question = questions[currentQuestionIndex];
        const isCorrect = parseInt(question.correctAnswer) === optionSelected;

        setUserAnswers(prev => [
            ...prev, 
            { questionId: question._id, answer: optionSelected, isCorrect }
        ]);

        setOptionSelected(null); // Reset selection
        setExplanation(question.options[parseInt(question.correctAnswer)]);

        if (currentQuestionIndex === questions.length - 1) {
            setFinished(true);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setExplanation('');
            setOptionSelected(null);
            setSubmitted(true);
        } else {
            setFinished(true);
            completePreTest();
            setExplanation('');
            setOptionSelected(null);
            setSubmitted(true);
        }
    };

    const completePreTest = async () => {
        setLoading(true);

        try {
            const data = {
                userId: session.user.id,
                contentGenId: id,
                pretest: userAnswers
            }

            const res = await axios.post('/api/personal/pretest', data);

            if (res.data.success) {
                await axios.post('/api/points/point', {
                    userId: session.user.id,
                    description: 'ทำข้อสอบ Pre-Test',
                    contentId: res.data.data._id,
                    path: 'personalized',
                    subpath: 'pretest',
                    type: 'earn',
                    points: 10
                });

                const answer = res.data.data.pretest
                const correctAnswer = answer.filter(item => item.isCorrect === true).length

                const result = await Swal.fire({
                    icon: 'success',
                    title: 'Congratulations!',
                    text: `คุณได้ทำข้อสอบ Pre-Test คุณตอบถูก ${correctAnswer} ข้อ`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0056FF',
                    allowOutsideClick: false,
                })

                if (result.isConfirmed) {
                    setQuestions([]);
                    setOptionSelected(null);
                    setUserAnswers([]);
                    setCurrentQuestionIndex(0);
                    setFinished(false);
                    setSubmitted(true);
                    router.back();
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
           
    }

    return (
        <div className="flex flex-col w-full bg-[#0056FF] min-h-[100vh]">
            <div className="flex flex-row justify-between items-center pt-4 pb-4 w-full">
                <IoIosArrowBack className="text-3xl text-white" onClick={() => router.back()} />
                <h1 className="flex text-2xl text-white font-bold">Pre-Test</h1>
                <div></div>
            </div>

            <div className="flex flex-col px-4 w-full">
                <div className="flex flex-col bg-white rounded-lg p-4 text-left">
                    <h1 className="text-xl font-bold">คำถามที่ {currentQuestionIndex + 1}</h1>
                    <Divider className="w-full my-2" />
                    <p className="text-md font-semibold">{questions[currentQuestionIndex].question}</p>
                    <div className="flex flex-col mt-4">
                        {questions[currentQuestionIndex].options?.map((option, index) => (
                            <div key={index} className="flex gap-1 text-md items-center mb-2">
                                <input 
                                    type="radio" 
                                    name={`option-${currentQuestionIndex}`} 
                                    value={index} 
                                    checked={optionSelected === index}
                                    onChange={() => setOptionSelected(index)}
                                    disabled={!submitted}
                                />
                                <label className={`cursor-pointer ${optionSelected === index ? 'font-bold' : ''} ml-2`}>
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>

                    {!submitted && (
                        <div className="flex items-center justify-center mt-4">
                            <span 
                                className={`font-bold text-md ${userAnswers[currentQuestionIndex].isCorrect ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {userAnswers[currentQuestionIndex].isCorrect ? 
                                    'ตอบถูก' : 'ตอบผิด'
                                }
                            </span>
                        </div>
                    )}

                    <div className="flex justify-center mt-4">
                        {submitted ? (
                            <button
                                className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full text-sm shadow-xl"
                                onClick={handleAnswer}
                                disabled={optionSelected === null}
                            >
                                ส่งคำถาม
                            </button>
                        ) : (
                            <button
                                className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full text-sm shadow-xl"
                                onClick={handleNextQuestion}
                            >
                                {finished ? 'เสร็จ' : 'คำถามต่อไป'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pretest;
