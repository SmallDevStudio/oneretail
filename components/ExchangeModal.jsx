import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import WarningModal from './WarningModal'; // Import the new WarningModal component
import Loading from './Loading';

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

const ExchangeModal = ({ isOpen, onRequestClose, points, conversionRate, userId, onExchangeAdd }) => {
    const [exchangePoints, setExchangePoints] = useState(conversionRate);
    const [coins, setCoins] = useState(1);
    const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCoins(Math.floor(exchangePoints / conversionRate));
    }, [exchangePoints, conversionRate]);

    const handleIncrementPoints = () => {
        const newPoints = exchangePoints + conversionRate;
        if (newPoints <= points) {
            setExchangePoints(newPoints);
        } else {
            setWarningModalIsOpen(true);
        }
    };

    const handleDecrementPoints = () => {
        const newPoints = exchangePoints - conversionRate;
        if (newPoints >= conversionRate) {
            setExchangePoints(newPoints);
        }
    };

    const handleIncrementCoins = () => {
        const newCoins = coins + 1;
        const newPoints = newCoins * conversionRate;
        if (newPoints <= points) {
            setCoins(newCoins);
            setExchangePoints(newPoints);
        } else {
            setWarningModalIsOpen(true);
        }
    };

    const handleDecrementCoins = () => {
        const newCoins = coins - 1;
        if (newCoins >= 1) {
            setCoins(newCoins);
            setExchangePoints(newCoins * conversionRate);
        }
    };

    const handleExchange = async () => {
        if (exchangePoints > points || exchangePoints <= 0 || coins <= 0) {
            setWarningModalIsOpen(true);
            return;
        }

        setLoading(true);

        const currentDate = new Date().toISOString();
        const description = `exchange ${currentDate}`;
        try {
            const exchangeResponse = await fetch('/api/exchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    points: exchangePoints,
                    coins,
                    description,
                }),
            });

            if (!exchangeResponse.ok) {
                throw new Error('Failed to create exchange');
            }
            const pointsResponse = await fetch('/api/points/point', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    points: exchangePoints,
                    contentId: null,
                    type: 'pay',
                    description,
                }),
            });

            if (!pointsResponse.ok) {
                throw new Error('Failed to update points');
            }

            const coinsResponse = await fetch('/api/coins/coins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    coins,
                    type: 'earn',
                    description,
                }),
            });

            
            setLoading(false);

            if (!coinsResponse.ok) {
                throw new Error('Failed to update coins');
            }
            onExchangeAdd();
            onRequestClose();
        } catch (error) {
            console.error('Failed to complete the exchange', error);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
                <div className='flex justify-end w-full'>
                    <button onClick={onRequestClose} className='text-black text-xl'>
                        <svg className='w-6 h-6 text-[#0056FF]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.6 259.71">
                            <path fill='currentColor' d="M131.8,259.71C59.13,259.71,0,201.45,0,129.85S59.13,0,131.8,0s131.8,58.25,131.8,129.85-59.13,129.85-131.8,129.85ZM131.8,21.38c-60.89,0-110.43,48.66-110.43,108.48s49.54,108.48,110.43,108.48,110.43-48.66,110.43-108.48S192.69,21.38,131.8,21.38ZM172.17,180.26c-2.71,0-5.41-1.02-7.5-3.07l-32.88-32.35-32.88,32.35c-4.21,4.14-10.97,4.08-15.11-.12-4.14-4.21-4.08-10.97.12-15.11l32.63-32.1-32.63-32.1c-4.21-4.14-4.26-10.91-.12-15.11,4.14-4.21,10.91-4.26,15.11-.12l32.88,32.35,32.88-32.35c4.21-4.14,10.97-4.08,15.11.12,4.14,4.21,4.08,10.97-.12,15.11l-32.63,32.1,32.63,32.1c4.21,4.14,4.26,10.91.12,15.11-2.09,2.13-4.85,3.19-7.62,3.19Z"/>
                        </svg>
                    </button>
                </div>
                <h2 style={{ textAlign: 'center' }} className='text-lg font-bold text-[#0056FF]'>
                    แลกเปลี่ยนคะแนน เป็น คอยน์
                </h2>
                <div style={{ textAlign: 'center' }} className='flex flex-col justify-center items-center'>
                    <div className='mb-4 mt-2 items-center justify-center'>
                        <Image src="/images/redeem/coins.png" alt="Coins" style={{ 
                            width: '100px',
                            height: 'auto',
                        }} width={100} height={100} />
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='flex items-center justify-start mb-2' style={{ width: '100%' }}>
                            <span className='flex text-[10px] text-gray-400'>
                                คะแนน one retail society
                            </span>
                        </div>
                        <div className='flex flex-row items-center mb-4'>
                            <div className='flex flex-col items-center justify-center'>
                                <div className='flex items-center justify-between mb-1'>
                                    <button onClick={handleDecrementPoints} className='px-2 py-1 bg-gray-200 rounded'>-</button>
                                    <span className='text-lg font-bold text-black mx-4'>{exchangePoints}</span>
                                    <button onClick={handleIncrementPoints} className='px-2 py-1 bg-gray-200 rounded'>+</button>
                                </div>
                                <div className='flex'>
                                    <span className='flex text-sm font-bold text-gray-700'>
                                        Point
                                    </span>
                                </div>
                            </div>
                            <span className='text-2xl text-black font-bold ml-4 mr-4'>
                                =
                            </span>
                            <div className='flex flex-col items-center justify-center'>
                                <div className='flex items-center justify-between mb-1'>
                                    <button onClick={handleDecrementCoins} className='px-2 py-1 bg-gray-200 rounded'>-</button>
                                    <span className='text-lg font-bold text-black mx-4'>{coins}</span>
                                    <button onClick={handleIncrementCoins} className='px-2 py-1 bg-gray-200 rounded'>+</button>
                                </div>
                                <div className='flex'>
                                    <span className='flex text-sm font-bold text-gray-700'>
                                        Coins
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-baseline justify-between w-full pr-4 pl-4'>
                        <span className='text-sm text-gray-400'>
                            แลกได้สูงสุด {Math.floor(points / conversionRate)} coin
                        </span>
                        <button 
                            className='bg-[#F68B1F] text-white font-bold py-2 px-4 rounded-full h-10 w-24 items-center justify-center' 
                            onClick={handleExchange}>
                            <span className='text-md'>
                                {loading ? 'กําลังแลก...' : 'แลกเลย'}
                            </span>
                        </button>
                    </div>
                </div>
            </Modal>
            <WarningModal 
                isOpen={warningModalIsOpen}
                onRequestClose={() => setWarningModalIsOpen(false)}
                message="คะแนนยังไม่พอนะจ๊ะ ไปเล่นเกม ดูวีดีโอเพิ่มก่อนนร้า"
            />
        </>
    );
};

export default ExchangeModal;
