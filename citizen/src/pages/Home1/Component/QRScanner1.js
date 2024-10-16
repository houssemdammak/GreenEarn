import React, { useState, useContext } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';import './QRScanner.css';
import AppContext from '../Context';

const QRScanner = (props) => {
  const myContext = useContext(AppContext);
  const updateContext = myContext.wasteDetails;
  const [scanned, setScannedText] = useState(null);

  const handleScan = (result) => {
    if (result[0].rawValue) {
      try {
        const parsedData = JSON.parse(result[0].rawValue);
        // Vérifie si les données scannées contiennent les propriétés nécessaires
        if (parsedData.binId && parsedData.quantity) {
          // Met à jour l'état local et le contexte avec les données scannées
          setScannedText(result);
          updateContext.qrCode = parsedData; // Mettre à jour le contexte avec le QR Code scanné
          updateContext.setBinID(parsedData.binId);
          updateContext.setQuantity(parsedData.quantity);
          // Fermer automatiquement le popup après le scan
          props.closePopup();
        } 
      } catch (error) {
        setScannedText("Please try again");
    }
    }else{
        setScannedText("Please try again");
}
  };

  const handleError = (error) => {
    console.error("QR scan error:", error);
    setScannedText("Scanning Error");
  };

  return (
    <div>
      <div className="videoWrapper">
        {/* QrReader est utilisé ici pour scanner le QR code */}
        <Scanner 
        onScan={handleScan} 
        onError={handleError}
       //   constraints={{ facingMode: 'environment' }} // Utilise la caméra arrière par défaut
        />
      </div>
      <p className="scannedText">{scanned}</p>
    </div>
  );
};

export default QRScanner;
