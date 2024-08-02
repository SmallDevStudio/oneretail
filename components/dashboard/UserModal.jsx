import Image from 'next/image';
import React from 'react';
import Modal from 'react-modal';
import Link from 'next/link';

Modal.setAppElement('#__next'); // Ensure this is correct and matches your main app element

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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
    }
};

const UserModal = ({ isOpen, onRequestClose, data }) => {
  console.log(data);
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
      <div className="flex flex-col justify-center items-center ">
        <Image
          src={data.pictureUrl}
          alt="profile"
          width={100}
          height={100}
          className="rounded-full"
        />
        <span className="text-2xl font-bold mt-2"><span>คะแนนรวมทั้งหมด : </span><span className="text-[#0056FF]">{data.totalPoints}</span></span>
        <div className="flex flex-col mt-2">
          <span><strong>ชื่อ - สกุล : </strong>{data.fullname}</span>
          <span><strong>รหัสพนักงาน : </strong>{data.empId}</span>
          <span><strong>TeamGrop : </strong>{data.teamGrop}</span>
          <span><strong>Branch : </strong>{data.branch}</span>
          <span><strong>Department : </strong>{data.department}</span>
          <span><strong>Group : </strong>{data.group}</span>
          <span><strong>Chief_th : </strong>{data.chief_th}</span>
          <span><strong>Chief_eng : </strong>{data.chief_eng}</span>
          <span><strong>Position : </strong>{data.position}</span>
        </div>
        
      </div>
    </Modal>
  );
};

export default UserModal;
