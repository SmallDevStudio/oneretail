import { useState, useEffect } from 'react';
import AddQuestionModal from './AddQuestionModal';
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useCSVReader } from 'react-papaparse';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress, 
  TablePagination 
} from '@mui/material';

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
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch('/api/questions1');
    const data = await res.json();
    setQuestions(data);
    setFilteredQuestions(data);
    setLoading(false);
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = questions.filter((question) =>
      question.question.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { field: 'question', headerName: 'Question', width: 300 },
    { field: 'options', headerName: 'Options', width: 300 },
    { field: 'correctAnswer', headerName: 'Correct Answer', width: 150 },
    { field: 'group', headerName: 'Group', width: 150 },
    { field: 'actions', headerName: 'Actions', width: 150 },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="flex flex-col m-10">
      <h1 className="text-3xl font-bold">เกมส์คำถาม</h1>
      <div className="flex justify-between mb-5">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
        >
          เพิ่มคำถาม
        </Button>
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
                <Button
                  variant="contained"
                  color="primary"
                  {...getRootProps()}
                >
                  Browse file
                </Button>
                <div className={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <Button
                  variant="contained"
                  color="secondary"
                  {...getRemoveFileProps()}
                >
                  Remove
                </Button>
              </div>
              <ProgressBar className={styles.progressBarBackgroundColor} />
            </>
          )}
        </CSVReader>
      </div>
      <div className="flex justify-end mb-4">
        <TextField
          variant="outlined"
          label="Search Question"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question) => (
              <TableRow key={question._id}>
                <TableCell>{question.question}</TableCell>
                <TableCell>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {question.options.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{question.options[question.correctAnswer]}</TableCell>
                <TableCell>{question.group}</TableCell>
                <TableCell>
                  <Button
                    className="mr-4 font-bold text-2xl hover:text-blue-800"
                    onClick={() => handleEdit(question)}
                  >
                    <CiEdit />
                  </Button>
                  <Button
                    className="mr-4 font-bold text-2xl hover:text-blue-800"
                    onClick={() => handleDelete(question._id)}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredQuestions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div className="mt-4 text-right">
        <p className="text-sm text-gray-600">Total Records: {filteredQuestions.length}</p>
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

export default QuestionTable;
