import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setQuestions, answerQuestion, nextQuestion, resetQuiz } from '@/lib/redux/quizSlice';
import QuizModal from './QuizModal';
import Loading from './Loading';

const Quiz = ({ userId, user, allQuestions }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentQuestionIndex, score } = useSelector((state) => state.quiz);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allQuestions && allQuestions.length > 0) {
      dispatch(setQuestions(allQuestions));
      setLoading(false);
    }
  }, [allQuestions, dispatch]);

  if (loading) {
    return <Loading />;
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
        await axios.post('/api/points', {
          userId,
          points: finalScore,
        });
      } catch (error) {
        setErrorMessage(
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'An unexpected error occurred.'
        );
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
    
      <div className='flex flex-row mb-4 gap-4 w-full items-center justify-center'>
        <div className='flex flex-row items-center gap-1'>
          <span className='text-sm font-bold'>กลุ่มคำถาม:</span>
          <div className='bg-[#0056FF] rounded-full text-white px-2 py-0.5'>
            <span>{question.group}</span>
          </div>
        </div>
        {user.position ? (
          <div className='flex flex-row items-center gap-1'>
            <span className='text-sm font-bold'>ตําแหน่ง:</span>
            <span className='bg-[#0056FF] rounded-full text-white px-2 py-0.5'>
              {user.position}
            </span>
          </div>
        ): (
          <div className='flex flex-row items-center gap-1'>
            <span className='text-sm font-bold'>TeamGrop:</span>
            <span className='bg-[#0056FF] rounded-full text-white px-2 py-0.5'>
              {user.teamGrop}
            </span>
          </div>
        )}
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
