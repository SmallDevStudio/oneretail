import React, { useState } from "react";

const QuizPanel = ({ quiz, handleAnswer }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [error, setError] = useState(null);

    const handleOptionClick = (index) => {
        setError(null);
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        console.log("Selected option:", selectedOption);
        // Check if an option is selected
        if (selectedOption !== null) {
            const isCorrect = selectedOption === parseInt(quiz.correctAnswer); // Ensure correctAnswer is an integer
            const answers = {
                answer: isCorrect,
                isAnswer: quiz.options[selectedOption]
            };
            handleAnswer(answers);

            // Reset the state after submitting
            setError(null);
            setSelectedOption(null);
        } else {
            setError("กรุณาเลือกคำตอบ");
        }
    };

    return (
        <div className="flex flex-col px-5 py-2 text-sm w-full">
            <div className="flex flex-row mb-2">
                <span className="font-bold mr-2">คำถาม:</span>
                <span>{quiz?.question}</span>
            </div>
            
            {quiz?.options.map((option, index) => (
                <div key={index} className="mb-1" onClick={() => handleOptionClick(index)}>
                    <div className={`flex flex-row rounded-3xl px-2 py-1 ${selectedOption === index ? "bg-[#F68B1F] text-white" : "bg-gray-300 text-black"}`}>
                        <span className="font-bold mr-2">{index + 1}.</span>
                        <span>{option}</span>
                    </div>
                </div>
            ))}
            {error && <p className="text-red-500 text-sm">*{error}</p>}
            <div className="flex justify-center">
                <button className="bg-[#0056FF] rounded-3xl px-2 py-1 mt-2 w-2/6 text-white font-bold"
                    onClick={handleSubmit}
                >
                    ส่งคำตอบ
                </button>
            </div>
        </div>
    );
};

export default QuizPanel;
