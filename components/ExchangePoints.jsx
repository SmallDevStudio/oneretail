import React from "react";
import ExchangeModal from "./ExchangeModal";
const ExchangePoints = ({ userPoints, userCoins }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [conversionRate, setConversionRate] = useState(100);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div>
            <button onClick={openModal}>แลกเปลี่ยนคะแนน</button>
            <ExchangeModal 
                isOpen={modalIsOpen} 
                onRequestClose={closeModal} 
                points={userPoints} 
                conversionRate={conversionRate} 
            />
            <div>
                <label>
                    Conversion Rate:
                    <input 
                        type="number" 
                        value={conversionRate} 
                        onChange={(e) => setConversionRate(e.target.value)} 
                        min="1" 
                    />
                </label>
            </div>
        </div>
    );
};