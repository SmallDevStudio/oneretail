import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setQuestions, answerQuestion, nextQuestion, resetQuiz, savePoints } from '@/lib/redux/quizSlice';
import Loading from './Loading';
import Swal from 'sweetalert2'

const Quiz = ({ userId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentQuestionIndex, score, showAnswer, status } = useSelector((state) => state.quiz);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/api/questions');
      const data = await res.json();
      dispatch(setQuestions(data));
    };
    fetchQuestions();
  }, [dispatch]);

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
      alert(`Quiz complete! Your score is: ${score}`);
      // บันทึกคะแนนผู้ใช้
      await dispatch(savePoints({ userId, points: score }));
      dispatch(resetQuiz());
      router.push('/games');
    }
  };

    return (
      <div className="flex flex-col items-center text-center bg-white">
        <h1 className="text-xl font-bold mb-4 mt-4">{question.question}</h1>
        <ul className="mt-5">
          {question.options.map((option, index) => (
            <li 
              className={`cursor-pointer mb-4 border-2 w-[300px] p-3 rounded-full bg-gray-200 hover:bg-[#0056FF] hover:text-white`}
              key={index} onClick={() => handleAnswer(index)}>{option}
            </li>
          ))}
        </ul>
        {showAnswer && (
          <div>
            <p className="text-sm font-bold mb-2 mt-2">
              {questions[currentQuestionIndex].correctAnswer === questions[currentQuestionIndex].index ? 'ถูกต้อง!' : 'ผิด!'}
            </p>
            <button
             className="border-2 p-3 rounded-xl w-[150px] bg-[#FF9800] hover:text-white"
             onClick={handleNext}>Next
             </button>
          </div>
        )}
      </div>
    );
  };
  
  export default Quiz;