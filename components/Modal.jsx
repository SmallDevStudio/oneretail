// components/Modal.js
import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    position: relative;
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 100%;
                    border: 3px solid #F68B1F;
                }
                .modal-close {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    background: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #F68B1F;
                    border: 2px solid #F68B1F;
                    border-radius: 20px;
                    padding: 2px 10px;
                    scale: 0.5;
                    transition: all 0.3s ease-in-out;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;
