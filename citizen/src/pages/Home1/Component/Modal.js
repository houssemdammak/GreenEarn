import React from 'react';
// import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import './Modal.css';

const customStyles = {
  height: 'auto',
  bottom: 'auto',
  top: '20%',
};
const Modal = ({ title, children, onClose, isOpen }) => {
    if (!isOpen) {
      return null; // Ne rend pas la modal si elle est fermée

    }
    
return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h2>{title}</h2>
        <div>{children}</div>
        <button className="multipleButton" onClick={onClose} >
          Close
        </button>
      </div>
    </div>
  );
};
  

export default Modal;
