import { useState, useEffect } from 'react';
import AddQuestionModal from './AddQuestionModal';
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

const QuestionTable = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5); // จำนวนคำถามต่อหน้า

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch('/api/questions');
    const data = await res.json();
    setQuestions(data);
  };

  const handleDelete = async (id) => {
    await fetch('/api/deleteQuestion', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    fetchQuestions();
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (questionData) => {
    if (editingQuestion) {
      await fetch('/api/updateQuestion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...questionData, id: editingQuestion._id }),
      });
    } else {
      await fetch('/api/addQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
    }
    fetchQuestions();
  };

   // Get current questions
   const indexOfLastQuestion = currentPage * questionsPerPage;
   const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
   const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

   // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col m-10">
      <h1 className="text-3xl font-bold">
        เกมส์คำถาม
    </h1>
      <button 
        className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/6 mb-5" 
        onClick={handleAdd}>เพิ่มคำถาม</button>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-blue-100 h-8">
          <tr className="h-8">
            <th className="w-1/3">Question</th>
            <th className="w-1/3">Options</th>
            <th className="w-1/5">Correct Answer</th>
            <th className="w-1/3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td>{question.question}</td>
              <td>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {question.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </td>
              <td>{question.options[question.correctAnswer]}</td>
              <td>
                <button 
                    className="mr-4 font-bold text-2xl hover:text-blue-800"
                    onClick={() => handleEdit(question)}>
                    <CiEdit />
                </button>
                <button 
                    className="mr-4 font-bold text-2xl hover:text-blue-800"
                    onClick={() => handleDelete(question._id)}>
                    <RiDeleteBinLine />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        questionsPerPage={questionsPerPage}
        totalQuestions={questions.length}
        paginate={paginate}
      />
      <AddQuestionModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingQuestion}
      />
    </div>
  );
};

const Pagination = ({ questionsPerPage, totalQuestions, paginate }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalQuestions / questionsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a onClick={() => paginate(number)} href="#" className="page-link">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

export default QuestionTable;