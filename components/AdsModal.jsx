// components/Modal.js
import React from 'react';
import PropTypes from 'prop-types';

const AdsModal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    z-index: 1000;
                    overflow: auto;
                    padding: 20px;
                }
                .modal-content {
                    position: relative;
                    max-width: 100%;
                    max-height: 100%;
                    width: 100%;
                }
                .modal-close {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    background: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #F68B1F;
                    border: none;
                    padding: 5px;
                }
            `}</style>
        </div>
    );
};

AdsModal.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AdsModal;
