import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setQuestions, answerQuestion, nextQuestion, resetQuiz } from '@/lib/redux/quizSlice';
import QuizModal from './QuizModal';
import Loading from './Loading';
import Modal from './Modal';

const Quiz = ({ userId, user, allQuestions }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentQuestionIndex, score } = useSelector((state) => state.quiz);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [finalScore, setFinalScore] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const checkIfPlayedToday = async () => {
      try {
        const response = await axios.get('/api/quiz/userQuiz', {
          params: { userId },
        });
        if (response.data.hasPlayedToday) {
          setHasPlayedToday(true);
        }
      } catch (error) {
        console.error('Error checking if played today:', error);
      }
    };
  
    checkIfPlayedToday();
  }, [userId, router]);

  useEffect(() => {
    if (loading) {
      if (allQuestions && allQuestions.length > 0) {
        dispatch(setQuestions(allQuestions));
      }
      setLoading(false);
    }
  }, [allQuestions, dispatch, loading]);

  useEffect(() => {
    if (currentQuestionIndex >= 2 && showAnswer && !isRecording) {
      setFinalScore(score); // ตั้งค่า finalScore ก่อน
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, showAnswer, score]);


  useEffect(() => {
    if (finalScore && currentQuestionIndex >= 2 && showAnswer && !isRecording) {
      const submitFinalScore = async () => {
        setIsRecording(true); // ป้องกันการเรียกซ้ำ
  
        try {
          // Submit user quiz record
          await axios.post('/api/quiz/userQuiz', {
            userId,
            score: finalScore,
          });
  
          // Add points if conditions met
          if (!hasPlayedToday) {
            if (finalScore > 0) {
              await axios.post('/api/points/point', {
                userId,
                description: 'Quiz Game',
                type: 'earn',
                contentId: null,
                path: 'game',
                subpath: 'quiz',
                points: finalScore,
              });
            }
            setIsModalOpen(true); // แสดง modal สำหรับผลลัพธ์
          } else {
            setShowModal(true); // แสดง modal แจ้งเตือนว่าผู้ใช้เล่นแล้ว
          }
        } catch (error) {
          setErrorMessage(
            error.response?.data?.message || 'An unexpected error occurred.'
          );
        } finally {
          setIsRecording(false); // ปิดสถานะ recording
        }
      };
  
      submitFinalScore();
    }
  }, [finalScore, currentQuestionIndex, showAnswer, userId, hasPlayedToday, isRecording]);

  console.log('hasPlayedToday:', hasPlayedToday);
  console.log('score:', score);
  console.log('currentQuestionIndex:', currentQuestionIndex);

  if (loading) return <Loading />;

  const question = questions[currentQuestionIndex];

  if (!question) return <div>No questions available</div>;
  

  const handleAnswer = (index) => {
    if (!showAnswer) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = async () => {
    const isCorrect = selectedAnswer === parseInt(question.correctAnswer);
    dispatch(answerQuestion({ isCorrect }));
    setShowAnswer(true);

    await axios.post('/api/answers', {
      userId,
      questionId: question._id,
      answer: selectedAnswer,
      isCorrect,
    });
  };

  const handleNext = () => {
    setShowAnswer(false);
    dispatch(nextQuestion());
    setSelectedAnswer(null);
  };

  const handleCloseModal = () => {
    dispatch(resetQuiz());
    setIsModalOpen(false);
    router.push('/games');
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className='p-4'>
      <div>
        <h1 className='text-3xl font-bold mb-2 text-[#0056FF]'>
          เกมส์คำถาม
        </h1>
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
          <p className={`text-lg font-bold mb-2 ${selectedAnswer === parseInt(question.correctAnswer) ? 'text-green-500' : 'text-red-500'}`}>
            {selectedAnswer === parseInt(question.correctAnswer) ? 'ถูก!' : 'ผิด!' }
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
        <QuizModal 
          isOpen={isModalOpen} 
          onRequestClose={handleCloseModal} 
          score={finalScore} 
        />

        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={handleClose}
          >
            <div className='flex flex-col justify-center items-center'>
              <span>คุณได้ {finalScore} คะแนน</span>
              <span>คุณได้รับ Point แล้วในวันนี้</span>
            </div>
          </Modal>
          )}
    </div>
  );
};

export default Quiz;
