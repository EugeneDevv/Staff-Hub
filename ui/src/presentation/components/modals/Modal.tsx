import React, { ReactNode } from 'react';
import './Modal.scss'
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  Heading: string;
  children:ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, Heading, children }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
  
      <div className='modal-content'>
      <div className="modal-header">
        <h2 className='headingModal'>{Heading}</h2>
        <p className='closeBtn' onClick={onClose}>Close</p>
      </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
