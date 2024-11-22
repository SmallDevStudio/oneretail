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
  const [isLastQuestionAnswered, setIsLastQuestionAnswered] = useState(false);

  useEffect(() => {
    const checkIfPlayedToday = async () => {
      try {
        const response = await axios.get('/api/quiz/userQuiz', {
          params: { userId },
        });
  
        setHasPlayedToday(response.data.hasPlayedToday || false);
  
        if (response.data.hasPlayedToday) {
          setLoading(false); // หากเล่นแล้วก็ยังให้เล่นใหม่ได้
        } else {
          setLoading(false); // หากยังไม่เคยเล่นในวันนี้
        }
      } catch (error) {
        console.error("Error checking play status:", error);
        setErrorMessage("An error occurred while checking game status.");
        setLoading(false);
      }
    };
  
    checkIfPlayedToday();
  }, [userId]);

  useEffect(() => {
    if (loading) {
      if (allQuestions && allQuestions.length > 0) {
        dispatch(setQuestions(allQuestions));
      }
      setLoading(false);
    }
  }, [allQuestions, dispatch, loading]);

  useEffect(() => {
    const submitFinalScore = async () => {
      if (isLastQuestionAnswered) {
        setFinalScore(score); // อัปเดตคะแนนสุดท้าย
  
        try {
          // บันทึกคะแนนลงใน /api/quiz/userQuiz
          await axios.post('/api/quiz/userQuiz', {
            userId,
            score,
          });
  
          if (!hasPlayedToday) {
            // หากผู้ใช้ยังไม่ได้ Point วันนี้
            if (score > 0) {
              await axios.post('/api/points/point', {
                userId,
                description: 'Quiz Game',
                type: 'earn',
                contentId: null,
                path: 'game',
                subpath: 'quiz',
                points: score,
              });
            } 

            setIsModalOpen(true); // แสดง Modal แสดงคะแนน
            
          } else {
            // กรณีผู้ใช้เล่นแล้วในวันนี้
            setShowModal(true);
          }
        } catch (error) {
          console.error("Error submitting final score:", error);
          setErrorMessage("An error occurred while submitting your score.");
        } finally {
          setIsLastQuestionAnswered(false); // รีเซ็ตสถานะ
        }
      }
    };
  
    submitFinalScore();
  }, [isLastQuestionAnswered, score, hasPlayedToday, userId]);
  

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
  
    // เก็บคำตอบใน /api/answers
    try {
      await axios.post('/api/answers', {
        userId,
        questionId: question._id,
        answer: selectedAnswer,
        isCorrect,
      });
  
      // หากเป็นคำถามสุดท้าย
      if (currentQuestionIndex === 2) {
        setIsLastQuestionAnswered(true); // ตั้งสถานะว่าตอบคำถามสุดท้ายแล้ว
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      setErrorMessage("An error occurred while saving your answer.");
    }
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
    dispatch(resetQuiz());
    setShowModal(false);
    router.push('/games');
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
              <span className='text-2xl font-bold mt-5'>คะแนน : {finalScore}</span>
              <span className='text-lg font-bold text-red-500 mt-2'>คุณได้รับ Point ในวันนี้แล้ว</span>
              <span className='text-lg font-bold text-red-500'>ลองใหม่ในวันพรุ่งนี้</span>

              <button
                className='bg-[#0056FF] text-white rounded-2xl px-4 py-2 border-2 mb-4 mt-5'
                onClick={handleClose}
              >
                ตกลง
              </button>
            </div>
          </Modal>
          )}
    </div>
  );
};

export default Quiz;
