import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import moment from "moment";
import "moment/locale/th";
import Loading from "../Loading";

moment.locale('th');

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ExaminationTable = () => {
    const { data: session } = useSession();
    const [questions, setQuestions] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [group, setGroup] = useState('');
    const [position, setPosition] = useState('');
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedExamination, setSelectedExamination] = useState([]);

    console.log(selectedExamination);

    const { data, error, isLoading } = useSWR('/api/examinations', fetcher);

    const handleAddOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = {
            questions,
            options,
            correctAnswer,
            group,
            position,
            active,
            creator: session.user.id
        }

        try {
            const response = await axios.post('/api/examinations', data);
            console.log(response.data);
            setLoading(false);
            setShowForm(false);
            setQuestions('');
            setOptions(['', '', '', '']);
            setCorrectAnswer(0);
            setGroup('');
            setPosition('');
            setActive(true);
        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleClearForm = () => {
        setQuestions('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setGroup('');
        setPosition('');
        setActive(true);
        setShowForm(false);
    };

    const handleDeleteExamination = async (id) => {
        try {
            const response = await axios.delete(`/api/examinations/${id}`);
            console.log(response.data);
            setSelectedExamination(selectedExamination.filter((examination) => examination._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditExamination = (examination) => {
        setQuestions(examination.questions);
        setOptions(examination.options);
        setCorrectAnswer(examination.correctAnswer);
        setGroup(examination.group);
        setPosition(examination.position);
        setActive(examination.active);
        setShowForm(true);
    };

    const handleUpdateExamination = async () => {
        try {
            const response = await axios.put(`/api/examinations/${selectedExamination._id}`, {
                questions,
                options,
                correctAnswer,
                group,
                position,
                active
            });
            console.log(response.data);
            setSelectedExamination([]);
            setShowForm(false);
            setQuestions('');
            setOptions(['', '', '', '']);
            setCorrectAnswer(0);
            setGroup('');
            setPosition('');
            setActive(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectExamination = (examination) => {
        if (selectedExamination.includes(examination)) {
            setSelectedExamination(selectedExamination.filter((ex) => ex !== examination));
        } else {
            setSelectedExamination([...selectedExamination, examination]);
        }
    };


    if (error) return <div>Failed to load</div>;
    if (isLoading) return <Loading />;

    return (
        <div>
            {/* Header */}
            <div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full">
                    เพิ่มคำถาม
                </button>
            </div>
            {/* Table */}
            <div className="flex flex-col overflow-x-auto mt-4 p-2">
                <table className="table table-auto w-full text-xs">
                    <thead className="bg-gray-200">
                        <tr>
                            <th></th>
                            <th className="w-20">ลําดับ</th>
                            <th>คำถาม</th>
                            <th>ตัวเลือก</th>
                            <th>ตัวเลือกที่ถูกต้อง</th>
                            <th>วันที่สร้าง</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.map((examination, index) => (
                            <tr key={index} className="hover:bg-gray-100 border-y">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedExamination.includes(examination._id)}
                                        onChange={() => handleSelectExamination(examination._id)}
                                    />
                                </td>
                                <td className="text-center">{index + 1}</td>
                                <td>{examination.questions}</td>
                                <td>
                                    {examination.options.map((option, index) => (
                                        <li key={index}>{option}</li>
                                    ))}
                                </td>
                                <td>{examination.correctAnswer}</td>
                                <td>{moment(examination.createdAt).format('LLL')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div>
                </div>
            </div>
            {/* Form */}
            {showForm && (
                <div>
                <div className="flex flex-row items-center gap-2 mb-1">
                    <label htmlFor="" className="font-bold">คำถาม</label>
                    <input 
                        type="text" 
                        name="question"
                        className="border-2 border-gray-300 rounded-full px-2 py-1 w-2/3"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="" className="font-bold">ตัวเลือก</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex flex-row items-center gap-2 mb-1">
                            <label htmlFor="">ตัวเลือกที่ {index + 1}</label>
                            <input 
                                type="text"
                                className="border-2 border-gray-300 rounded-full px-2 py-1"
                                value={option}
                                onChange={(e) => handleAddOption(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-2 mt-2">
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="" className="font-bold">Group</label>
                        <input 
                            type="text"
                            name="group"
                            className="border-2 border-gray-300 rounded-full px-2 py-1"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="" className="font-bold">Position</label>
                        <input 
                            type="text"
                            name="position"
                            className="border-2 border-gray-300 rounded-full px-2 py-1"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 mt-2">
                    <label htmlFor="" className="font-bold">ตัวเลือกที่ถูกต้อง</label>
                    <select
                        className="border-2 border-gray-300 rounded-full px-2 py-1"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                    >
                        {options.length === 0 ? (
                            <option value="">กรุณาเพิ่มตัวเลือก</option>
                        ):
                        options.map((option, index) => (
                            <option key={index} value={index}>
                                {index + 1} - {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-row items-center gap-2 mt-2">
                    <button
                        className="bg-[#0056FF] text-white rounded-full px-4 py-2 mt-2"
                        onClick={handleSubmit}
                    >
                        {loading ? 'Loading...' : 'บันทึก'}
                    </button>
                    <button
                        className="bg-[#F2871F] text-white rounded-full px-4 py-2 mt-2"
                        onClick={handleClearForm}
                    >
                        ยกเลิก
                    </button>
                    
                </div>
            </div>
            )}
        </div>
    );
};

export default ExaminationTable;