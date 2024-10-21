import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Modal from 'react-modal';
import CircularProgress from '@mui/material/CircularProgress';

Modal.setAppElement('#__next');

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
      minWidth: '300px',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

export default function Qrcode({ url, open, onClose }) {

    const handleDownload = () => {
        const canvas = document.getElementById("qr-code-download");
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl
            downloadLink.download = `OneRetail-Forms.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={onClose}
        style={customStyles}
        contentLabel="QR Code Modal"
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <div className='flex justify-end'>
              <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                  <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
              </svg>
            </div>
        </button>
        {url && (
          <div 
            className='flex flex-col justify-center items-center mt-5'
            style={{ textAlign: 'center' }}
        >
            <QRCodeCanvas 
                id="qr-code-download"
                value={url} 
                size={220}
                bgColor={'#fff'}
                fgColor={'#0056FF'}
                level={'L'}
                includeMargin={true}
                imageQuality={1}
                style={{ width: '220px', height: '220px' }}
                renderAs={'canvas'}
            />
            <p 
                style={{ marginTop: '10px' }} 
                className='font-bold text-[#0056FF]'
            >
                    OneRetial Forms
            </p>
            <div>
                <button
                    className='bg-[#F2871F] text-white font-bold py-1.5 px-4 rounded-full mt-2'
                    onClick={handleDownload}
                    style={{ width: '150px' }}
                >
                    Download
                </button>
            </div>
            <p className='text-sm mt-2'>{url}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
