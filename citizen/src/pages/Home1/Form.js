import React, { useContext, useState } from 'react';
import AppContext from './Context';
import './styles.css';
import QRScanner from './Component/QRScanner1';
import Modal from './Component/Modal';
import qrscan from "../../images/qrscan.png";

const Form = () => {
  const myContext = useContext(AppContext);
  const updateContext = myContext.wasteDetails;

  // Fonction pour vérifier si les champs sont vides ou non
  const areFieldsFilled = () => {
    return (
      updateContext.binID &&
      updateContext.quantity
    );
  };
  
  const getBindetail = async () => {
    try {
        const response = await fetch(`/api/bins/${updateContext.binID}`);
        const products = await response.json();
        
        console.log(products);
        return products;
    } catch (error) {
        console.error('Error fetching bin details:', error);
        return null;
    }
};
  const next = async () => {
    updateContext.setStep(updateContext.currentPage + 1);

    // const products = await getBindetail();
        // try {
            const products = await getBindetail();
            if (products) {
                 updateContext.setwasteType(products.type);
                 updateContext.setBinID(products._id)
                 updateContext.setBlockchainID(products.BlockchainID)
                // updateContext.setStep(updateContext.currentPage + 1);
                updateContext.setDeposit(true)
                console.log(updateContext)
            }else {
                console.log('No bin details found');
            }              
            
        // } catch (error) {
        //     console.error('Error getting bin details:', error);
        // }
};
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  return (
    <div className="container-home">
      {isPopupOpen  && (
      <p>Please Scan Qr Code</p>
      
      )}
      <div className='buttonScanImage'>
      <button className="ScanButton" type="button" onClick={openPopup}>    Scan QR Code    </button>
      <img  src={qrscan}  style={{ width: "80px", height: "80px",marginLeft:"20px"}} alt="register" />
      </div>
      
      {/* Bouton pour ouvrir la popup */}
      

      {/* Le composant Modal s'affiche uniquement si isPopupOpen est true */}
      <Modal isOpen={isPopupOpen} title="Scan QR Code" onClose={closePopup}>
        <div className="qrScannerContainer">
          <QRScanner closePopup={closePopup} />
        </div>
      </Modal>

      {/* Formulaire qui s'affiche uniquement lorsque la popup est fermée et que tous les champs sont remplis */}
      {!isPopupOpen && areFieldsFilled() && (
        <>
          <p>You have deposited </p>

          <div className="formContain">
            <form className="form">
              <input
                className="formInput"
                type="text"
                maxLength="24"
                placeholder="Bin ID"
                value={updateContext.binID || ''}
                onChange={e => updateContext.setBinID(e.target.value)}
                readOnly hidden
              />
              {/* <input
                className="formInput"
                type="text"
                placeholder="Type of waste"
                value={updateContext.wasteType || ''}
                onChange={e => updateContext.setwasteType(e.target.value)}
                readOnly
              /> */}
              <input
                className="formInput"
                type="text"
                placeholder="Quantity in kg"
                value={updateContext.quantity || ''}
                onChange={e => updateContext.setQuantity(e.target.value)}
              />
              <button className="doneSubmit" onClick={next}>Next</button>

            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Form;
