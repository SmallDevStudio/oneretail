import React from 'react';
import Modal from 'react-modal';
import Image from 'next/image';

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
        height: 'auto',
        width: '350px',
    }
};

const ClubLeaderBoardModal = ({ isOpen, onRequestClose, data }) => {
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
                            <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                <div className='flex justify-center mt-2 mb-2'>
                  <h2 className="text-2xl font-bold">{data.name}</h2>
                </div>
                <Image 
                    src={data.pictureUrl || '/images/avatar-placeholder.png'} 
                    alt={data.name} 
                    width="100" 
                    height="100" 
                    className="rounded-full"
                />
                <div className="flex flex-col">
                  <p className="mt-4 text-sm"><strong>Employee ID:</strong> {data.empId}</p>
                  <p className="text-sm"><strong>Rank:</strong> {data.rank}</p>
                  <p className="text-sm"><strong>Branch:</strong> {data.branch}</p>
                  <p className="text-sm"><strong>Zone:</strong> {data.zone}</p>
                  {data.position && <p className="text-sm"><strong>Position:</strong> {data.position}</p>}
                  {data.channel && <p className="text-sm"><strong>Channel:</strong> {data.channel}</p>}
                  {data.gh && <p className="text-sm"><strong>GH:</strong> {data.gh}</p>}
                  {data.region && <p className="text-sm"><strong>Region:</strong> {data.region}</p>}
                  {data.rsn && <p className="text-sm"><strong>RSN:</strong> {data.rsn}</p>}
                  {data.rating && <p className="text-sm"><strong>Rating:</strong> {data.rating}</p>}
                  {data.totalscore && <p className="text-sm"><strong>Total Score:</strong> {data.totalscore}</p>}
                  {data.kpi && <p className="text-sm"><strong>KPI:</strong> {(data.kpi * 100).toFixed(2) + '%'}</p>}
                  {data.achieve && <p className="text-sm"><strong>Achieve:</strong> {(data.achieve * 100).toFixed(2) + '%'}</p>}
                </div>
            </div>
        </Modal>
    );
};

export default ClubLeaderBoardModal;
