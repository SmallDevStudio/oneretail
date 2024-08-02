import Image from 'next/image';
import React, { useState } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';
import useSWR from 'swr';

Modal.setAppElement('#__next'); // Ensure this is correct and matches your main app element

const fetcher = (url) => fetch(url).then((res) => res.json());

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '20px',
      height: '80%',
      width: '350px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
    }
};

const LevelModal = ({ isOpen, onRequestClose }) => {
  const { data, error } = useSWR('/api/level', fetcher);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleClickPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = currentPage * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Modal 
        isOpen={isOpen} 
        onRequestClose={onRequestClose} 
        style={customStyles}
    >
      <div className="modal-header">
        <div className='flex justify-end w-full'>
            <button onClick={onRequestClose} className='text-black text-xl'>
                <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                    <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                </svg>
            </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center overflow-scroll">
        <div className="flex justify-center items-center mb-2">
          <strong className="text-[#0056FF] font-bold text-xl">ลำดับ Level</strong>
        </div>
        {currentData.map((level) => (
          <div key={level.id} className="flex flex-row justify-center items-baseline gap-5">
            <span><strong>Level: </strong><span className="text-[#0056FF] font-bold">{level.level}</span></span>
            <span><strong>Point: </strong><span className="text-[#0056FF] font-bold">{level.requiredPoints}</span></span>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          className={`bg-[#0056FF] text-white px-4 py-2 rounded-md mr-2 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleClickPrev}
          disabled={currentPage === 0}
        >
          Prev
        </button>
        <button
          className={`bg-[#0056FF] text-white px-4 py-2 rounded-md ml-2 ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleClickNext}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </Modal>
  );
};

export default LevelModal;
