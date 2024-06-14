// components/ExchangeModal.jsx
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
    }
};

const ExchangeModal = ({ isOpen, onRequestClose, points, conversionRate, userId }) => {
    const [exchangePoints, setExchangePoints] = useState(20);
    const [coins, setCoins] = useState(1);
    const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCoins(Math.floor(exchangePoints / conversionRate));
    }, [exchangePoints, conversionRate]);

    const handleChange = (e) => {
        let value = e.target.value.replace(/^0+/, ''); // Remove leading zeros
        value = value === '' ? 0 : parseInt(value, 10); // Ensure value is an integer

        if (value > points) {
            setWarningModalIsOpen(true);
        } else {
            setExchangePoints(value);
        }
    };

    const handleExchange = async () => {
        if (exchangePoints > points) {
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
                    point: exchangePoints,
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

            onRequestClose();
        } catch (error) {
            console.error('Failed to complete the exchange', error);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
                <h2 style={{ textAlign: 'center' }} className='text-lg font-bold text-[#0056FF]'>
                    แลกเปลี่ยนคะแนน เป็น คอยล์
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
                        <div className='flex flex-row items-start'>
                            <div className='relative'>
                                <input 
                                    type="number"
                                    value={exchangePoints}
                                    onChange={handleChange}
                                    max={points} 
                                    min="0"
                                    style={{ textAlign: 'center', width: '130px' }}
                                    className='relative border-b-2 border-gray-300 rounded-lg p-2'
                                />
                                <div className='absolute top-2 right-0'>
                                    <span className='relative text-sm font-bold text-gray-700 pr-4'>
                                        Point
                                    </span>
                                </div>
                            </div>
                            <span className='text-2xl text-black font-bold m-4'>
                                =
                            </span>
                            <div className='relative'>
                                <input 
                                    type="text"
                                    value={coins}
                                    readOnly
                                    style={{ textAlign: 'center', width: '130px' }}
                                    className='flex border-b-2 border-gray-300 rounded-lg p-2'
                                />
                                <div className='absolute top-2 right-0'>
                                    <span className='relative text-sm font-bold text-gray-700 pr-4'>
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
