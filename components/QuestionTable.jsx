import { useState, useEffect } from 'react';
import AddQuestionModal from './AddQuestionModal';
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useCSVReader } from 'react-papaparse';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  browseFile: {
    width: '20%',
  },
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  },
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  },
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  },
};

const QuestionTable = () => {
  const { CSVReader } = useCSVReader();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch('/api/questions1');
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

  const handleCSVImport = async (data) => {
    setUploadStatus('Uploading...');
    setError('');

    try {
      const questions = data.slice(1).map((row) => {
        if (!row.data || row.data.length < 7) {
          throw new Error('Invalid CSV format');
        }
        if (!row.data[0] || !row.data[1] || !row.data[2] || !row.data[3] || !row.data[4] || !row.data[5] || !row.data[6]) {
          throw new Error('Missing required fields');
        }
        return {
          question: row.data[0],
          options: [row.data[1], row.data[2], row.data[3], row.data[4]],
          correctAnswer: Number(row.data[5]) - 1, // assuming correctAnswer is 1-based index in CSV
          group: row.data[6],
        };
      });

      const response = await fetch('/api/importQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });
      const result = await response.json();
      if (result.success) {
        setUploadStatus('Upload successful!');
        fetchQuestions();
      } else {
        setUploadStatus('');
        setError('Upload failed: ' + result.message);
      }
    } catch (err) {
      setUploadStatus('');
      setError('Upload failed: ' + err.message);
    }
  };


  return (
    <div className="flex flex-col m-10">
      <h1 className="text-3xl font-bold">เกมส์คำถาม</h1>
      <div className="flex justify-between mb-5">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          onClick={handleAdd}>เพิ่มคำถาม</button>
        <CSVReader
          onUploadAccepted={(results) => {
            handleCSVImport(results.data);
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }) => (
            <>
              <div className="flex gap-2">
                <button type="button" {...getRootProps()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Browse file
                </button>
                <div className={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <button {...getRemoveFileProps()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Remove
                </button>
              </div>
              <ProgressBar className={styles.progressBarBackgroundColor} />
            </>
          )}
        </CSVReader>
      </div>
      <div className="flex justify-end">
        {uploadStatus && <div className="text-green-500 mb-2">{uploadStatus}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-blue-100 h-8">
          <tr className="h-8">
            <th className="w-1/3">Question</th>
            <th className="w-1/3">Options</th>
            <th className="w-1/5">Correct Answer</th>
            <th className="w-1/5">Group</th>
            <th className="w-1/3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.slice(
            currentPage * questionsPerPage - questionsPerPage,
            currentPage * questionsPerPage
          ).map((question) => (
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
              <td>{question.group}</td>
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
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">Total Records: {questions.length}</p>
        <Pagination
          questionsPerPage={questionsPerPage}
          totalQuestions={questions.length}
          paginate={setCurrentPage}
        />
      </div>
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