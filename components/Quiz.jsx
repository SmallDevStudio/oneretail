// components/Quiz.js
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setQuestions, answerQuestion, nextQuestion, resetQuiz, savePoints, calculateLevel } from '@/lib/redux/quizSlice';
import QuizModal from './QuizModal';
import axios from 'axios';

const Quiz = ({ userId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentQuestionIndex, score, status } = useSelector((state) => state.quiz);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime] = useState(new Date());

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/api/questions');
      const data = await res.json();
      dispatch(setQuestions(data));
    };
    fetchQuestions();
  }, [dispatch]);

  if (questions.length === 0) return <div>Loading...</div>;

  const question = questions[currentQuestionIndex];

  const handleAnswer = (index) => {
    if (!showAnswer) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = async () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    dispatch(answerQuestion({ isCorrect }));
    setShowAnswer(true);

    // บันทึกคำตอบของผู้ใช้
    await fetch('/api/answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        questionId: question._id,
        answer: selectedAnswer,
        isCorrect,
      }),
    });

    if (currentQuestionIndex >= questions.length - 1) {
      setIsModalOpen(true);
      if (score > 0) {
        // บันทึกคะแนนผู้ใช้
        await axios.post('/api/points', {
          userId,
          points: score,
        });
      
      }
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    dispatch(nextQuestion());
    setSelectedAnswer(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(resetQuiz());
    router.push('/games');
  };

  return (
    <div className='p-4'>
      <div>
        <h1 className='text-3xl font-bold mb-5 text-[#0056FF]'>
          เกมส์คำถาม
        </h1>
      </div>
    
        <div className='flex flex-row mb-4 gap-2 w-full items-center justify-center'>
          <span className='text-lg font-bold'>กลุ่มคำถาม:</span>
          <div className='bg-[#0056FF] rounded-2xl text-white px-2 py-1 shadow-sm border-1 border-gray-400'>
            <span>{question.group}</span>
          </div>
        </div>

      <h1 className='text-lg font-bold mb-4'>
        {question.question}
      </h1>
      <ul className='px-4 text-md gap-2'>
        {question.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleAnswer(index)}
            style={{ 
              cursor: showAnswer ? 'default' : 'pointer', 
              backgroundColor: selectedAnswer === index ? '#F68B1F' : 'whitesmoke', 
              color: showAnswer && index === question.correctAnswer ? 'red' : 'black',
              fontWeight: showAnswer && index === question.correctAnswer ? 'bold' : 'normal',
              pointerEvents: showAnswer ? 'none' : 'auto'
            }}
            className='hover:bg-[#0056FF] hover:text-[#F68B1F] text-black rounded-2xl px-4 py-2 border-2 mb-4'
          >
            {option}
          </li>
        ))}
      </ul>
      {showAnswer ? (
        <>
          <p className={`text-lg font-bold mb-2 ${selectedAnswer === question.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
            {selectedAnswer === question.correctAnswer ? 'ถูก!' : 'ผิด!' }
          </p>
          <p className='text-lg font-bold mb-2'>คำตอบที่ถูก: {question.options[question.correctAnswer]}</p>
          <button onClick={handleNext}
            className='bg-[#F68B1F] text-white rounded-2xl px-4 py-2 border-2 mb-4'
          >
            คำถามต่อไป
          </button>
        </>
      ) : (
        <button onClick={handleSubmit} disabled={selectedAnswer === null}
          className='bg-[#0056FF] text-white rounded-2xl px-4 py-2 border-2 mb-4'
        >
          ส่งคำตอบ
        </button>
      )}
      <QuizModal isOpen={isModalOpen} onRequestClose={handleCloseModal} score={score} />
    </div>
  );
};

export default Quiz;
