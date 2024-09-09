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
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(true);
    const [explanation, setExplanation] = useState('');

    const { data, error, isLoading } = useSWR("/api/examinations/", fetcher);
    const { data: session } = useSession();
    const router = useRouter();

    console.log('userAnswers', userAnswers);
    console.log('explanation', explanation);

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
        }

        setExplanation(question.options[parseInt(question.correctAnswer)]);

        if (currentQuestionIndex === questions.length - 1) {
            if (!isCorrect || userAnswers.some(ans => !ans.isCorrect)) {
                // Move to review if any answers were incorrect
                setCurrentQuestionIndex(userAnswers.findIndex(ans => !ans.isCorrect));
            } else {
                // Complete if all were correct on first pass
                completeExam();
            }
        } 
    };

    const handleNextQuestion = () => {
        if (reviewMode) {
            const nextIncorrectIndex = userAnswers.findIndex((ans, index) => index > currentQuestionIndex && !ans.isCorrect);
            if (nextIncorrectIndex !== -1) {
                setCurrentQuestionIndex(nextIncorrectIndex);
            } else {
                completeExam(); // No more incorrect answers to review
            }
        } else {
            setCurrentQuestionIndex(curr => curr + 1);
            setSubmitted(true);
            setOptionSelected(null);
        }
    };

    const completeExam = () => {
        Swal.fire("Congratulations!", "You have completed the examination.", "success").then(() => {
            router.push('/main');
        });
    };

    return (
        <div className="flex flex-col w-full bg-[#0056FF] min-h-[100vh]">
            <div className="flex flex-col justify-center items-center pt-4 pb-4 w-full">
                <h1 className="flex text-2xl text-white font-bold">Examinations</h1>
            </div>

            <div className="flex flex-col px-4 w-full">
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
                                {userAnswers[currentQuestionIndex]?.isCorrect ? 'Correct!' : 'Incorrect!'}
                            </span>
                            <p className="text-sm">
                                <strong>Explanation:</strong> {explanation}
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
                                Submit
                            </button>
                        ) : (
                            <button
                                className="bg-[#F2871F] text-white font-bold py-2 px-4 rounded-full text-sm shadow-xl"
                                onClick={handleNextQuestion}
                            >
                                Next Question
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationsPage;

ExaminationsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
ExaminationsPage.auth = true;
