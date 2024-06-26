// components/Quiz.js
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setQuestions, answerQuestion, nextQuestion, resetQuiz } from '@/lib/redux/quizSlice';
import QuizModal from './QuizModal';
import axios from 'axios';
import Loading from './Loading';
import useSWR from 'swr';
import { CircularProgress } from '@mui/material';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Quiz = ({ userId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentQuestionIndex, score } = useSelector((state) => state.quiz);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startTime] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(true);

  const { data: adminActions, error: adminActionError } = useSWR('/api/adminActions', fetcher);
  const { data: allQuestions, error: questionError } = useSWR('/api/questions', fetcher);

  useEffect(() => {
    if (adminActions && adminActions.data && adminActions.data.length > 0 && allQuestions) {
      const latestAction = adminActions.data[adminActions.data.length - 1];
      const groupName = latestAction.groupName;
      const filteredQuestions = groupName === 'ทั้งหมด'
        ? allQuestions
        : allQuestions.filter(question => question.group === groupName);
      dispatch(setQuestions(filteredQuestions));
      setLoading(false);
    }
  }, [adminActions, allQuestions, dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (questionError || adminActionError) {
    return <div>Failed to load</div>;
  }

  const question = questions[currentQuestionIndex];

  if (!question) {
    return <div>No questions available</div>;
  }

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
      const finalScore = score;

      try {
        // บันทึกคะแนนผู้ใช้
        await axios.post('/api/points', {
          userId,
          points: finalScore,
        });
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      
      setIsModalOpen(true);
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
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <QuizModal isOpen={isModalOpen} onRequestClose={handleCloseModal} score={score} />
    </div>
  );
};

export default Quiz;
