import React from 'react';
import Button from './Button';

const Modal = ({ message, type, onClose })=> {
  if (!message) return null;

  const colors = {
    error: 'bg-red-800 border-red-600',
    success: 'bg-green-800 border-green-600',
  };
  const color = type === 'success' ? colors.success : colors.error;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 ${color} border-2 rounded-lg shadow-xl p-6 max-w-sm w-full animate-fadeIn`}>
        <p className="text-white text-lg mb-4">{message}</p>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
};

export default Modal;