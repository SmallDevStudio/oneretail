// components/GenerateQRCode.jsx
import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import Modal from 'react-modal';
import { useSession } from 'next-auth/react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    padding: '20px',
    width: '300px',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const GenerateQRCode = () => {
  const { data: session } = useSession();
  const [point, setPoint] = useState(0);
  const [coins, setCoins] = useState(0);
  const [ref, setRef] = useState('');
  const [remark, setRemark] = useState('');
  const [qrCodeLink, setQRCodeLink] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleGenerate = async () => {
    try {
      const userId = session?.user?.id;

      const response = await axios.post('/api/qrcode', {
        userId,
        point,
        coins,
        ref,
        remark,
      });

      const transactionId = response.data.data._id;
      const link = `${window.location.origin}/redeemqr?transactionId=${transactionId}`;
      setQRCodeLink(link);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error generating QR Code:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='p-2'>
      <div className='text-center mt-5 mb-5'>
        <h2 className='text-2xl font-bold text-[#0056FF]'>Generate QR Code</h2>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        <div>
          <label className='font-bold'>Points:</label>
          <input
            type="number"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            className='w-1/2 border-2 rounded-xl text-center ml-2'
          />
        </div>
        <div>
          <label className='font-bold'>Coins:</label>
          <input
            type="number"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className='w-1/2 border-2 rounded-xl text-center ml-2'
          />
        </div>
      </div>
      <div className='flex flex-row gap-2 mt-2 items-center'>
        <label className='font-bold'>Reference:</label>
        <input
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className='w-full border-2 rounded-xl pl-3'
        />
      </div>
      <div className='flex flex-row gap-2 mt-2 items-center'>
        <label className='font-bold'>Remark:</label>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className='w-full border-2 rounded-xl pl-3'
        />
      </div>
      <div className='flex mt-2 w-full items-center justify-center'>
        <button onClick={handleGenerate}
          className='bg-[#0056FF] text-white rounded-full p-2 mt-2 font-bold text-center w-40'
        >Generate</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="QR Code Modal"
      >
        <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <div className='flex justify-end'>
              <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                  <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
              </svg>
            </div>
        </button>
        {qrCodeLink && (
          <div style={{ textAlign: 'center' }}>
            <QRCode value={qrCodeLink} 
              size={220}
            />
            <p style={{ marginTop: '10px' }} className='font-bold text-[#0056FF]'>Scan to Redeem</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GenerateQRCode;
