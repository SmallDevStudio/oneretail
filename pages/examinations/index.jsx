import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { AppLayout } from "@/themes";
import Swal from "sweetalert2";
import Divider from '@mui/material/Divider';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ExaminationsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [optionSelected, setOptionSelected] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [reviewMode, setReviewMode] = useState(false);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]); // เก็บคำถามที่ตอบไม่ถูก
    const [showIncorrectAnswers, setShowIncorrectAnswers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [submitted, setSubmitted] = useState(true);
    const [explanation, setExplanation] = useState('');

    const { data, error, isLoading } = useSWR("/api/examinations/", fetcher);
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    useEffect(() => {
        if (session) {
            const res = axios.get(`/api/examinations/answers?userId=${userId}`);
            res.then((res) => {
                if (res.data && res.data.data && res.data.data.length > 0) {
                    router.push("/main");
                    return;
                }
            });
        }
    }, [router, session, userId]);

    useEffect(() => {
        if (session) {
            const res = axios.get(`/api/users/${userId}`);
            res.then((res) => {
                if (res.data && 
                    res.data.user.teamGrop !== 'AL' &&
                    res.data.user.teamGrop !== 'Retail' &&
                    res.data.user.teamGrop !== 'CRSG') {
                    router.push("/main");
                    return;
                    }
            });
        }
    }, [router, session, userId]);

    useEffect(() => {
        if (data && data.data) {
            setQuestions(data.data);
        }
    }, [data]);

    if (error) return <div>Failed to load</div>;
    if (isLoading || !questions.length) return <Loading />;

    const handleAnswer = async () => {
        setSubmitted(false);
        const question = questions[currentQuestionIndex];
        const isCorrect = parseInt(question.correctAnswer) === optionSelected;
    
        setUserAnswers(prev => [
            ...prev, 
            { questionId: question._id, answer: optionSelected, isCorrect }
        ]);

        setOptionSelected(null); // Reset selection
        if (!isCorrect) {
            // Add to review mode if incorrect
            setReviewMode(true);
            setIncorrectAnswers(prev => [...prev, 
                {
                    index: currentQuestionIndex, 
                    questionId: question._id,
                    questions: question.questions,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    isCorrect: false
                }
            ]);
        }

        setExplanation(question.options[parseInt(question.correctAnswer)]);

        if (incorrectAnswers && incorrectAnswers.length < 0 && incorrectAnswers.length === 0) {
            setFinished(true);
        }

        
    };

    const handleNextQuestion = () => {
       if (currentQuestionIndex < questions.length - 1) {
           setCurrentQuestionIndex(prev => prev + 1);
           setExplanation('');
           setOptionSelected(null);
           setSubmitted(true);
       } else if (incorrectAnswers.length > 0 ) {
            setCurrentQuestionIndex(0);
            setShowIncorrectAnswers(true);
            setExplanation('');
            setOptionSelected(null);
            setSubmitted(true);
        } else {
            setFinished(true);
            completeExam();
            setExplanation('');
            setOptionSelected(null);
            setSubmitted(true);
        }
    };


    const handleIncorrectAnswers = async () => {
        setSubmitted(false);
        const question = incorrectAnswers[currentQuestionIndex];
        const isCorrect = parseInt(question.correctAnswer) === optionSelected;
    
        setUserAnswers(prev => [
            ...prev, 
            { questionId: question._id, answer: optionSelected, isCorrect }
        ]);

        setOptionSelected(null); // Reset selection
        if (!isCorrect) {
            // Add to review mode if incorrect
            setReviewMode(true);
            setIncorrectAnswers(prev => [...prev, 
                {
                    index: question.index, 
                    questionId: question.questionId,
                    questions: question.questions,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    isCorrect: false
                }
            ]);
        }else{
            const Correct = incorrectAnswers.map(item => {
                if(item._id === question._id){
                    return {...item, isCorrect: true};
                }
                return item;
            });
            setIncorrectAnswers(Correct);
        }
        setExplanation(question.options[parseInt(question.correctAnswer)]);

        if (incorrectAnswers.length === 0) {
            setFinished(true);
        }
    }

    const handleNextIncorrect = () => {
        if (currentQuestionIndex < incorrectAnswers.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setExplanation('');
            setOptionSelected(null);
            setSubmitted(true);
        }else {
            setFinished(true);
            setShowIncorrectAnswers(false);
            setExplanation('');
            setOptionSelected(null);
            completeExam();
        }
    }

    const completeExam = async () => {
        setLoading(true);
        try {
            const data = {
                userId,
                exams: userAnswers,
            }
            const res = await axios.post('/api/examinations/answers', data);

            if (res.data.success) {
                console.log(res.data);
                await axios.post('api/points/point', {
                    userId: userId,
                    description: 'ทำข้อสอบ',
                    contentId: res.data.data._id,
                    path: 'examinations',
                    subpath: '',
                    type: 'earn',
                    points: 20
                });
            }
        } catch (error) {
            console.log(error);
        } 

       setLoading(false);

       Swal.fire("Congratulations!", "คุณได้ทำข้อสอบถูกทุกข้อแล้ว", "success")
        .then(() => {
            router.push('/main');
        });
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col w-full bg-[#0056FF] min-h-[100vh]">
            <div className="flex flex-col justify-center items-center pt-4 pb-4 w-full">
                <h1 className="flex text-2xl text-white font-bold">Examinations</h1>
            </div>

            <div className="flex flex-col px-4 w-full">
                {!showIncorrectAnswers ? (
                    <div className="flex flex-col bg-white rounded-lg p-4 text-left">
                    <h1 className="text-xl font-bold">คำถามที่ {currentQuestionIndex + 1}</h1>
                    <Divider className="w-full my-2" />
                    <p className="text-md font-semibold">{questions[currentQuestionIndex].questions}</p>
                    <div className="flex flex-col mt-2">
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <div key={index} className="flex gap-1 text-sm items-start">
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
                        <div className="mt-4">
                            <span 
                                className={`font-bold text-md ${userAnswers[currentQuestionIndex]?.isCorrect ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {userAnswers[currentQuestionIndex]?.isCorrect ? 
                                    'ตอบถูก' : 'ตอบผิด'
                                }
                            </span>
                            <p className="text-sm">
                                <strong>คำเฉลย:</strong> {explanation}
                            </p>
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
                ) : (
                    showIncorrectAnswers && incorrectAnswers.length > 0 && (
                        <div className="flex flex-col bg-white rounded-lg p-4 text-left">
                        <h1 className="text-xl font-bold">คำถามที่ {incorrectAnswers[currentQuestionIndex].index +1}</h1>
                        <Divider className="w-full my-2" />
                        <p className="text-md font-semibold">{incorrectAnswers[currentQuestionIndex].questions}</p>
                        <div className="flex flex-col mt-2">
                        {incorrectAnswers[currentQuestionIndex].options.map((option, index) => (
                            <div key={index} className="flex gap-1 text-sm items-start">
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
                        <div className="mt-4">
                            <span 
                                className={`font-bold text-md ${incorrectAnswers[currentQuestionIndex]?.isCorrect ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {incorrectAnswers[currentQuestionIndex]?.isCorrect ? 
                                    'ตอบถูก' : 'ตอบผิด'
                                }
                            </span>
                            <p className="text-sm">
                                <strong>คำเฉลย:</strong> {explanation}
                            </p>
                        </div>
                        )}

                        <div className="flex justify-center mt-4">
                        {submitted ? (
                            <button
                                className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full text-sm shadow-xl"
                                onClick={handleIncorrectAnswers}
                                disabled={optionSelected === null}
                            >
                                ส่งคำถาม
                            </button>
                        ) : (
                            <button
                                className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full text-sm shadow-xl"
                                onClick={handleNextIncorrect}
                            >
                                {finished ? 'เสร็จ' : 'คำถามต่อไป'}
                            </button>
                        )}
                        </div>

                    </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ExaminationsPage;

ExaminationsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
ExaminationsPage.auth = true;
