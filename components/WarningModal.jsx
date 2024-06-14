import React from 'react';
import Modal from 'react-modal';

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

const WarningModal = ({ isOpen, onRequestClose, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Warning Modal"
            style={customStyles}
        >
            <h2 className='text-lg font-bold text-center text-red-500'>Warning</h2>
            <p className='text-center'>{message}</p>
            <div className='flex justify-center mt-4'>
                <button
                    onClick={onRequestClose}
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default WarningModal;