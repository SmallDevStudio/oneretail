import { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // เพื่อป้องกัน warning ในการใช้ Modal

const AddQuestionModal = ({ isOpen, onRequestClose, onSubmit, initialData }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [group, setGroup] = useState('');
  
    useEffect(() => {
      if (initialData) {
        setQuestion(initialData.question);
        setOptions(initialData.options);
        setCorrectAnswer(initialData.correctAnswer);
        setGroup(initialData.group);
      } else {
        setQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setGroup('');
      }
    }, [initialData]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ question, options, correctAnswer, group });
      onRequestClose();
    };
  
    const handleOptionChange = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };
  
    return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="react-modal-content" overlayClassName="react-modal-overlay">
        <div className="modal-header">
            <h2 className="text-2xl font-bold text-[#0056FF]">
                {initialData ? 'แก้ไขคําถาม' : 'เพิ่มคําถาม'}
            </h2>
          <button className="modal-close-button" onClick={onRequestClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className='font-bold text-lg'>
                คำถาม
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-lg ml-7 text-sm h-10"
              required
            />
          </div>
          <div>
            {options.map((option, index) => (
              <div key={index}>
                <label>คำตอบที่ {index + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border-2 border-gray-300 p-2 rounded-lg ml-4 text-sm h-10 mb-2"
                  required
                />
              </div>
            ))}
          </div>
          <div>
            <label className='font-bold text-lg'>
                เลือกคำตอบที่ถูก
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
              className="border-2 border-gray-300 p-2 rounded-lg ml-7 text-sm h-10"
              required
            >
              {options.map((_, index) => (
                <option key={index} value={index}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className='font-bold text-lg'>
                Group
            </label>
            <input
              type="text"
              value={group}
              onChange={(e) => setQuestion(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-lg ml-7 text-sm h-10"
            />
          </div>
          <button 
            className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-lg mt-4" 
            type="submit">{initialData ? 'Update Question' : 'Add Question'}
        </button>
        </form>
      </Modal>
    );
  };
  

export default AddQuestionModal;