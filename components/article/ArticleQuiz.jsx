import React, { useState, useEffect } from "react";

const ArticleQuiz = ({ handleQuizClose, saveQuiz, data, edit }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  useEffect(() => {
    if (edit) {
      if (data) {
        setQuestion(data.question);
        setOptions(data.options);
        setCorrectAnswer(data.correctAnswer);
      }
    } else {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);
    }
  }, [edit, data]);

  const handleOptions = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    const quizData = {
      question,
      options,
      correctAnswer,
    };
    saveQuiz(quizData);
  };

  const handleClose = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    handleQuizClose();
  };

  return (
    <div className="flex flex-col w-full gap-4 border-2 px-4 py-2 rounded-3xl text-xs">
      <div className="flex flex-row w-full items-center gap-4">
        <label className="flex text-black font-bold" htmlFor="question">
          คำถาม
        </label>
        <textarea
          placeholder="คำถาม"
          name="question"
          value={data.question}
          className="flex text-black border-2 p-1 rounded-xl w-1/2"
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-row w-full items-center">
        {options.map((option, index) => (
          <div key={index} className="flex flex-row w-full items-center gap-4">
            <label className="flex text-black font-bold" htmlFor="options">
              ตัวเลือก {index + 1}
            </label>
            <input
              type="text"
              placeholder="ตัวเลือก"
              name="options"
              value={option}
              className="flex text-black border-2 p-1 rounded-xl w-1/2"
              onChange={(e) => handleOptions(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-row w-full items-center gap-4">
        <label className="flex text-black font-bold" htmlFor="correctAnswer">
          คำตอบ
        </label>
        <select
          className="flex text-black border-2 p-1 rounded-xl"
          name="correctAnswer"
          value={data.correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        >
          {options.map((_, index) => (
            <option key={index} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row w-full items-center gap-4">
        <button
          className="bg-[#0056FF] text-white p-2 rounded-full w-20"
          onClick={handleSubmit}
        >
          {edit ? "อัปเดต" : "เพิ่ม"}
        </button>
        <button
          className="bg-[#F68B1F] text-white p-2 rounded-full w-20"
          onClick={handleClose}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default ArticleQuiz;
