import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import styles from '@/styles/memorycardgame.module.css';
import MemoryModal from '../MemoryModal';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const GameBoard = ({ images }) => {
    const { data: session } = useSession();
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [moves, setMoves] = useState(0);
    const [bestScore, setBestScore] = useState(Infinity);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown timer
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [score, setScore] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        const shuffledImages = shuffleArray([...images, ...images]);
        setCards(shuffledImages);
    }, [images]);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setIsModalOpen(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const saveGamePlay = async () => {
        if (session) {
            const userId = session.user.id;
            const gameData = {
                userId,
                moves,
                score,
                timeLeft
            };

            try {
                const response = await axios.post('/api/memorygame', gameData);
                console.log(response.data);
            } catch (error) {
                console.error('Error saving game play:', error);
            }
        }
    };

    const handleCardClick = (index) => {
        if (flippedIndices.length === 1) {
            const firstIndex = flippedIndices[0];
            if (cards[firstIndex] === cards[index]) {
                setMatchedIndices([...matchedIndices, firstIndex, index]);
                setScore(score + 1);
                if (matchedIndices.length + 2 === cards.length) {
                    clearInterval(timerRef.current);
                    saveGamePlay();
                    setIsModalOpen(true);
                    
                }
            }
            setFlippedIndices([...flippedIndices, index]);
            setMoves(moves + 1);
        } else {
            setFlippedIndices([index]);
        }
    };

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setTimeout(() => setFlippedIndices([]), 1000);
        }
    }, [flippedIndices]);


    const closeModal = () => {
        setIsModalOpen(false);
        // Redirect to /games after closing the modal
        window.location.href = '/games';
    };

    return (
        <div className="p-4 mb-20 bg-white shadow-lg rounded-xl m-4 w-full">
            <h1 className="text-2xl font-bold text-[#0056FF]">เกมจับคู่</h1>
            <p className='text-gray-400 text-sm mb-2'>เลือกไพ่สองใบที่มีเนื้อหาเดียวกัน</p>
            <div>
                <div className="text-gray-400 text-sm mb-2 flex justify-evenly">
                    <span className='font-bold'>MOVES: {moves} </span>
                </div>
                <p className="text-[#F68B1F] text-[3rem] mb-2 font-bold">{timeLeft}</p> {/* Display countdown timer */}
            </div>
            <div className="relative w-full">
                <div className={styles.board}>
                    {cards.map((image, index) => (
                        <Card
                            key={index}
                            image={image}
                            onClick={() => handleCardClick(index)}
                            isFlipped={flippedIndices.includes(index)}
                            isMatched={matchedIndices.includes(index)}
                        />
                    ))}
                </div>
            </div>
            
            <MemoryModal isOpen={isModalOpen} onRequestClose={closeModal} score={score} />
        </div>
    );
};

export default GameBoard;
