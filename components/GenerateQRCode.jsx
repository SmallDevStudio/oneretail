// components/GenerateQRCode.jsx
import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import Modal from 'react-modal';
import { useSession } from 'next-auth/react'; // Import useSession to get the current user session

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
  const { data: session } = useSession(); // Get the current session
  const [point, setPoint] = useState(0);
  const [coins, setCoins] = useState(0);
  const [ref, setRef] = useState('');
  const [remark, setRemark] = useState('');
  const [qrCodeData, setQRCodeData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleGenerate = async () => {
    try {
      const userId = session?.user?.id; // Get the userId of the admin

      const response = await axios.post('/api/qrcode', {
        userId,
        point,
        coins,
        ref,
        remark,
      });

      setQRCodeData(response.data.data);
      setModalIsOpen(true); // Open the modal
    } catch (error) {
      console.error('Error generating QR Code:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='flex flex-col p-4 mt-5'>
        <div className='flex items-center justify-center'>
            <h2 className='text-2xl font-bold text-[#0056FF]'>Generate QR Code</h2>
        </div>
        <div className='flex flex-row mt-5'>
            <div className='flex flex-row items-center'>
                <label className='font-bold'>Points:</label>
                <input
                type="number"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                className="ml-2 border-2 rounded-xl text-center w-1/2"
                />
            </div>
            <div className='flex flex-row items-center ml-4'>
                <label className='font-bold'>Coins:</label>
                <input
                type="number"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                className="ml-2 border-2 rounded-xl text-center w-1/2"
                />
            </div>
        </div>
        <div className='flex flex-row items-center mt-2'>
            <label className='font-bold'>Reference:</label>
            <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className="ml-2 border-2 rounded-xl w-full"
            />
        </div>
        <div className='flex flex-row items-center mt-2'>
            <label className='font-bold'>Remark:</label>
            <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="ml-2 border-2 rounded-xl w-full"
            />
        </div>
        <div className='flex items-center mt-5 w-full justify-center'>
            <button onClick={handleGenerate}
                className="bg-[#0056FF] hover:bg-[#0056FF]/80 text-white font-bold py-2 px-4 rounded-full w-1/2"
            >
                Generate
            </button>
        </div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="QR Code Modal"
        >
            <div className="flex w-full">
                <button onClick={closeModal} style={{ position: 'absolute', top: '5px', right: '5px' }}>
                    <svg className='w-6 h-6 text-black' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                        <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                    </svg>
                </button>
            </div>
            {qrCodeData && (
            <div style={{ textAlign: 'center' }} className='w-full'>
                <QRCode value={JSON.stringify({ transactionId: qrCodeData._id })} size={200} className="mx-auto" />
            </div>
            )}
        </Modal>
        </div>
  );
};

export default GenerateQRCode;
