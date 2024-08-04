import React, {useState, useEffect} from "react";

const ArticleQuizEdit = ({ handleQuizClose, saveQuiz, data, edit}) => {
    const [quiz, setQuiz] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [answer, setAnswer] = useState(0);

    console.log(data.options);
    console.log(options);

    useEffect(() => {
        if(edit) {
            if(data) {
                setQuiz(data.quiz);
                setOptions(data.options);
                setAnswer(data.answer);
            }
        } else {
            setQuiz('');
            setOptions(['', '', '', '']);
            setAnswer(0);
        }
    }, [edit, data]);

    const handleOptions = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        const quizData = {
            quiz,
            options,
            answer
        };
        saveQuiz(quizData);
    }

    const handleClose = () => {
        setQuiz('');
        setOptions(['', '', '', '']);
        setAnswer(0);
        handleQuizClose();
    }


    return (
        <div className="flex flex-col w-full gap-4 border-2 px-4 py-2 rounded-3xl">
            <div className="flex flex-row w-full items-center gap-4">
                <label className="flex text-black font-bold" htmlFor="quiz">
                    คำถาม
                </label>
                <input
                    type="text"
                    placeholder="คำถาม"
                    name="quiz"
                    value={data.quiz}
                    className="flex text-black border-2 p-2 rounded-xl"
                    onChange={(e) => setQuiz(e.target.value)}
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
                            className="flex text-black border-2 p-2 rounded-xl"
                            onChange={(e) => handleOptions(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex flex-row w-full items-center gap-4">
                <label className="flex text-black font-bold" htmlFor="answer">
                    คำตอบ
                </label>
                <select
                    className="flex text-black border-2 p-2 rounded-xl"
                    name="answer"
                    value={data.answer}
                    onChange={(e) => setAnswer(e.target.value)}
                >
                    {options.map((_, index) => (
                        <option key={index} value={index}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-row w-full items-center gap-4">
                <button className="bg-[#0056FF] text-white p-2 rounded-full w-20"
                    onClick={handleSubmit}
                >
                    {edit ? "อัปเดต" : "เพิ่ม"}
                </button>
                <button className="bg-[#F68B1F] text-white p-2 rounded-full w-20" 
                    onClick={handleClose}
                >
                    ยกเลิก
                </button>
            </div>
        </div>

    );
};

export default ArticleQuizEdit;