import React from 'react';
import Modal from 'react-modal';
import Image from 'next/image';

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
        width: '90%',
        border: '5px solid #F68B1F',
    }
};

const RedeemModal = ({ isOpen, onRequestClose, redeemItem }) => {
    if (!redeemItem) return null;

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='flex justify-end'>
                <button onClick={onRequestClose} className='text-black text-xl'>
                    <svg className='w-6 h-6 text-[#F68B1F]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                        <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                    </svg>
                </button>
            </div>
            <div className='flex flex-col items-center text-center justify-center'>
                <Image 
                    src={redeemItem.image} 
                    width={300} 
                    height={300} 
                    alt={redeemItem.name} 
                    style={{width: '300px', height: 'auto', objectFit: 'contain'}}
                />
                <h2 className='text-3xl font-bold text-[#0056FF]'>{redeemItem.name}</h2>
                <p className='text-md text-gray-600'>{redeemItem.description}</p>
                <div className='flex justify-center items-center mt-4'>
                    <span className='text-sm font-bold'>Coins:</span>
                    <span className='ml-2 text-lg text-[#0056FF] font-bold'>{redeemItem.coins}</span>
                    <Image
                        src="/images/profile/Coin.svg"
                        alt="coins"
                        width={15}
                        height={15}
                        className="ml-2"
                    />
                </div>
                {redeemItem.point > 0 ? (
                <div className='mt-2'>
                    <span className='text-sm font-bold'>Points:</span>
                    <span className='ml-2 text-lg text-[#0056FF] font-bold'>{redeemItem.point}</span>
                </div>) : ''
                }

                <div>
                    <button
                        className='w-full bg-[#F68B1F] text-white font-bold py-2 px-4 rounded-full mt-4'
                        onClick={handleRedeemClick(redeemItem)}
                    >
                        แลกของรางวัล
                    </button>
                </div>
                
            </div>
        </Modal>
    );
};

export default RedeemModal;
