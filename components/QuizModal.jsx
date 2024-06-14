import Image from 'next/image';
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // เพื่อป้องกัน warning ในการใช้ Modal

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '20px',
      height: 'auto',
      width: '350px',
    }
  };

const QuizModal = ({ isOpen, onRequestClose, score }) => {
  return (
    <Modal 
        isOpen={isOpen} 
        onRequestClose={onRequestClose} 
        style={customStyles}
        >
      <div className="modal-header">
        <h2 className="text-2xl font-bold"></h2>
        <div className='flex justify-end'>
            <button onClick={onRequestClose} className='text-black text-xl'>
                <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                    <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                </svg>
            </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-[-50px]">
        <p className="text-[200px] font-bold text-[#0056FF]">
            {score}
        </p>
        <div className="flex flex-row justify-center items-baseline mt-[-50px]">
            <Image src="/images/profile/Point.svg" alt="Point" width={40} height={40} />
            <p className="text-3xl font-bold ml-3 text-[#0056FF]">
                Point
            </p>
        </div>
      </div>
      <div className="modal-footer">
      </div>
    </Modal>
  );
};

export default QuizModal;