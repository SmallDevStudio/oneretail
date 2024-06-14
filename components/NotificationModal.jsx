import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const NotificationModal = ({ isOpen, onRequestClose, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Notification Modal"
      className="flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Notification</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onRequestClose}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default NotificationModal;