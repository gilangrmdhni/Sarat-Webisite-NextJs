import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Notification = ({ message, type, onClose }) => {
    return (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-md flex items-center space-x-3 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            <span>{message}</span>
            <button onClick={onClose} className="focus:outline-none">
                <FontAwesomeIcon icon={faTimesCircle} className="text-white" />
            </button>
        </div>
    );
};

export default Notification;
