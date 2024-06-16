import React, { useState, useEffect } from 'react';
import Card from './Card';
import styles from '@/styles/memorycardgame.module.css'; // นำเข้า CSS module

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const GameBoard = ({ images }) => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [moves, setMoves] = useState(0);
    const [bestScore, setBestScore] = useState(Infinity);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown timer

    useEffect(() => {
        const shuffledImages = shuffleArray([...images, ...images]);
        setCards(shuffledImages);
    }, [images]);

    useEffect(() => {
        if (timeLeft === 0) {
            alert('Time is up!');
            restartGame();
        }
        const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const handleCardClick = (index) => {
        if (flippedIndices.length === 1) {
            const firstIndex = flippedIndices[0];
            if (cards[firstIndex] === cards[index]) {
                setMatchedIndices([...matchedIndices, firstIndex, index]);
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

    const restartGame = () => {
        setMatchedIndices([]);
        setFlippedIndices([]);
        setMoves(0);
        setTimeLeft(60);
        setCards(shuffleArray([...images, ...images]));
    };

    return (
        <div className='text-center justify-center items-center w-full'>
            <div className='relative border-2 p-2 w-full bg-white'>
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
            <div>
                <p>MOVES: {moves} BEST SCORE: {bestScore === Infinity ? 0 : bestScore}</p>
                <p>TIME LEFT: {timeLeft} seconds</p>
                <button onClick={restartGame}>RESTART</button>
            </div>
        </div>
    );
};

export default GameBoard;
