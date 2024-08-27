import Image from 'next/image';
import React from 'react';
import Modal from 'react-modal';

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
      width: '500px',
    }
};

const SatisfactionView = ({ isOpen, onRequestClose, data }) => {
    console.log('data', data);
  return (
    <Modal 
        isOpen={isOpen} 
        onRequestClose={onRequestClose} 
        style={customStyles}
    >
      <div className="modal-header">
        <div className='flex justify-end w-full'>
            <button onClick={onRequestClose} className='text-black text-xl'>
                <svg className='w-4 h-4 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                    <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                </svg>
            </button>
        </div>
      </div>
      <div className="flex flex-col text-sm text-left w-full">
        <div className="flex flex-col">
            <p className='font-bold'>
                1. คุณพึงพอใจกับการใช้งาน One Retail Society โดยรวมมากน้อยแค่ไหน?
            </p>
            <span className='text-[#0056FF] font-bold'>{data.satisfied}</span>
        </div>
        <div className="flex flex-col">
            <p className='font-bold'>
                2. คุณจะแนะนำ One Retail Society ของเราให้ผู้อื่นหรือไม่?
            </p>
            <span className='text-[#0056FF] font-bold'>{data.recommend}</span>
        </div>
        <div className="flex flex-col">
            <p className='font-bold'>
                3. ฟีเจอร์ใดที่คุณชอบมากที่สุดใน One Retail Society?
            </p>
            <div className="flex flex-wrap gap-2">
                {data.featureLike.map((feature, index) => (
                    <span key={index} className='text-[#0056FF] font-bold'>{feature}</span>
                ))}
            </div>
        </div>
        <div className="flex flex-col">
            <p className='font-bold'>
                4. ฟีเจอร์ใดที่คุณคิดว่าควรปรับปรุง?
            </p>
            <div className="flex flex-wrap gap-2">
                {data.improved.map((improved, index) => (
                    <span key={index} className='text-[#0056FF] font-bold'>{improved}</span>
                ))}
            </div>
        </div>
        <div className="flex flex-col">
            <p className='font-bold'>
                5. มีฟีเจอร์อื่นๆ ที่คุณอยากให้เราเพิ่มหรือไม่?
            </p>
            <span className='text-[#0056FF] font-bold'>{data.featuresAdd}</span>
        </div>
        <div className="flex flex-col">
            <p className='font-bold'>
                6.คุณเคยเจอปัญหาในการใช้งาน One Retail Society บ้างไหม?
            </p>
            <span className='text-[#0056FF] font-bold'>{data.problems}</span>
        </div>
        <div className="flex flex-col">
            <p className='font-bold'>
                7. คุณมีข้อเสนอแนะอะไรที่จะช่วยให้ One Retail Society ดีขึ้น?
            </p>
            <span className='text-[#0056FF] font-bold'>{data.suggestions}</span>
        </div>
      </div>
      <div className="modal-footer flex justify-center w-full">
      </div>
    </Modal>
  );
};

export default SatisfactionView;
