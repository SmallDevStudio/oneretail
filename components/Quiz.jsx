import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setQuestions, answerQuestion, nextQuestion, resetQuiz, savePoints } from '@/lib/redux/quizSlice';
import Loading from './Loading';
import Swal from 'sweetalert2'
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const Quiz = ({ userId }) => {
  const [appLoading, setAppLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentQuestionIndex, score, showAnswer, status } = useSelector((state) => state.quiz);

  const { data, error } = useSWR('/api/questions', fetcher);

  useEffect(() => {
    if (data) {
      dispatch(setQuestions(data));
      setAppLoading(false);
    } 
  }, [data, dispatch]);

  if (questions.length === 0) return <Loading />;

  const question = questions[currentQuestionIndex];

  const handleAnswer = (index) => {
    const isCorrect = index === question.correctAnswer;
    dispatch(answerQuestion({ isCorrect }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      const totalScore = score === 3 ? 5 : score; // ให้ 5 คะแนนถ้าตอบถูก 3 ข้อ
      alert(`Quiz complete! Your score is: ${totalScore}`);
      // บันทึกคะแนนผู้ใช้
      await dispatch(savePoints({ userId, points: totalScore }));
      dispatch(resetQuiz());
      router.push('/games');
    }
  };

  if (appLoading) {
    return <Loading />;
  }

    return (
      <div className="flex flex-col items-center text-center bg-white p-2">
        <h1 className="text-lg font-bold mt-4">{question.question}</h1>
        <ul className="mt-4">
            {question.options.map((option, index) => (
                <li 
                    className={`cursor-pointer mb-4 border-1 text-sm p-2 rounded-xl bg-gray-200 hover:bg-[#0056FF] hover:text-white shadow-md`}
                    key={index} 
                    onClick={() => handleAnswer(index)}
                >
                    {option}
                </li>
            ))}
        </ul>
        {showAnswer && (
            <div className="mt-4">
                <span className="text-sm font-bold inline-block">
                    {questions[currentQuestionIndex].correctAnswer === currentQuestionIndex ? 'ถูกต้อง!' : 'ผิด!'} 
                </span><br />
                <span className="text-sm font-bold inline-block">
                  คำตอบที่ถูกคือ: <span className='text-[#0056FF]'>{question.options[question.correctAnswer]}</span>
                </span>
                <div className="flex justify-center">
                  <button
                      className="border-2 p-3 rounded-full w-[150px] bg-[#FF9800] hover:text-white mt-3"
                      onClick={handleNext}
                  >
                      ถัดไป
                  </button>
                </div>
            </div>
        )}
    </div>
    );
  };
  
  export default Quiz;