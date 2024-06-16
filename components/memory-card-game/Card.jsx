import React from 'react';
import styles from '@/styles/card.module.css'; // นำเข้า CSS module
import Image from 'next/image';

const Card = ({ image, onClick, isFlipped, isMatched }) => {
    return (
        <div className={`${styles.card} ${isFlipped || isMatched ? styles.flipped : ''}`} onClick={onClick}>
            <div className={styles.inner}>
                <div className={styles.back}>
                    <Image src="/images/memorycardgame/cover.png" alt="back" width={300} height={300}/>
                </div>
                <div className={styles.front}>
                    <Image src={image} alt="card" width={300} height={300}/>
                </div>
            </div>
        </div>
    );
};

export default Card;
