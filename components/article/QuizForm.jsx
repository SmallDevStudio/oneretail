import React, { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";

const QuizForm = ({ data, handleUpldateQuiz, articleId, userId }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  useEffect(() => {
    if (selectedQuiz) {
      setQuestion(selectedQuiz.question);
      setOptions(selectedQuiz.options);
      setCorrectAnswer(selectedQuiz.correctAnswer);
    } else {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);
    }
  }, [selectedQuiz]);

  const handleAddSubmit = async () => {
    const newQuiz = {
      articleId,
      userId,
      question,
      options,
      correctAnswer,
    };

    try {
      if (selectedQuiz) {
        // If editing, send PUT request to update the quiz
        await axios.put(
          `/api/articles/quiz/update?quizId=${selectedQuiz._id}`,
          newQuiz
        );
      } else {
        // If adding, send POST request to create a new quiz
        await axios.post("/api/articles/quiz", newQuiz);
      }

      handleUpldateQuiz();
      handleCloseForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedQuiz(null);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
    setSelectedQuiz(null);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setOpenForm(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center mt-2 gap-3 w-full">
        <span className="flex font-bold text-lg">จัดการคำถาม</span>
        <FaCirclePlus
          className="flex text-[#0056FF]"
          size={20}
          onClick={() => handleOpenForm()}
        />
      </div>
      {/* Quiz List */}
      <div className="flex flex-col mt-1">
        {Array.isArray(data) &&
          data.map((quiz, index) => (
            <div key={index}>
              <div className="flex flex-row rounded-md px-1 py-1">
                <span className="flex w-10">{index + 1}</span>
                <span className="flex w-[250px] whitespace-pre-line line-clamp-3 leading-tight text-left">
                  {quiz.question}
                </span>
                <div className="flex flex-row">
                  <FaRegEdit
                    className="ml-2 text-[#F68B1F]"
                    size={18}
                    onClick={() => handleEditQuiz(quiz)}
                  />
                  <IoIosCloseCircle
                    className="ml-2 text-red-500"
                    size={18}
                    onClick={() => {
                      /* Handle delete functionality here */
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Quiz Form */}
      {openForm && (
        <div className="flex flex-col w-3/4 border-2 p-2 rounded-xl gap-2 mt-2">
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold nowrap">
              {selectedQuiz ? "แก้ไขคำถาม:" : "เพิ่มคำถาม:"}
            </span>
            <textarea
              type="text"
              value={question}
              className="w-2/3 border-2 border-gray-300 rounded-lg p-1 text-xs"
              placeholder="กรุณากรอกคำถาม"
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            <span className="font-bold nowrap">ตัวเลือกคำตอบ:</span>
            <div className="flex flex-row items-center gap-1">
              {options.map((option, index) => (
                <div key={index} className="flex flex-row items-center gap-2">
                  <label>ตัวเลือกที่ {index + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    className="w-30 border-2 border-gray-300 rounded-lg p-1 text-xs"
                    placeholder="กรุณากรอกตัวเลือก"
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <span className="font-bold nowrap">ตัวเลือกที่ถูกต้อง:</span>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
              className="w-1/6 border-2 border-gray-300 rounded-lg p-1 text-xs"
            >
              {options.map((option, index) => (
                <option key={index} value={index}>
                  ตัวเลือกที่ {index + 1} - {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row items-center w-full mt-2 gap-2">
            <button
              className="bg-[#0056FF] text-white rounded-full font-bold px-2 py-1"
              onClick={() => handleAddSubmit()}
            >
              บันทึก
            </button>

            <button
              className="bg-[#F68B1F] text-white rounded-full font-bold px-2 py-1"
              onClick={() => handleCloseForm()}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
