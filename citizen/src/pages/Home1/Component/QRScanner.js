import React, { useEffect, useRef, useState, useContext } from 'react';
import QrScanner from 'qr-scanner';
import './QRScanner.css';
import AppContext from '../Context';

const QRScanner = (props) => {
  const videoElementRef = useRef(null);
  const myContext = useContext(AppContext);
  const updateContext = myContext.wasteDetails;
  const [scanned, setScannedText] = useState(null);

  useEffect(() => {
    const video = videoElementRef.current;
    const qrScanner = new QrScanner(
      video,
      (result) => {
        try {
          // Tente de parser le résultat en JSON
          const parsedData = JSON.parse(result.data);
          console.log(result)
          // Valide si les propriétés attendues sont présentes
          if (parsedData.binId && parsedData.type && parsedData.quantity) {
            // Met à jour l'état local et le contexte avec l'objet JSON
        setScannedText(result.data);
        updateContext.qrCode = JSON.parse(result.data); // Enregistre dans le contexte

        console.log(updateContext.qrCode)
        updateContext.setBinID(updateContext.qrCode.binId);
        updateContext.setwasteType(updateContext.qrCode.type);
        updateContext.setQuantity(updateContext.qrCode.quantity);
        // Ferme automatiquement le modal après avoir scanné
        props.closePopup();
          } else {
            setScannedText("Please try again")
          }
        } catch (error) {
          setScannedText("Scanning Error")
        }
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScanner.start();
    const redWeight = 0.3; // poids pour la composante rouge
    const greenWeight = 0.59; // poids pour la composante verte
    const blueWeight = 0.11; // poids pour la composante bleue
    qrScanner.setGrayscaleWeights(redWeight, greenWeight, blueWeight, true);
    // qrScanner.setInversionMode("invert");
    console.log('QR Scanner started');

    // Fonction de nettoyage pour arrêter et détruire le scanner
    return () => {
      console.log('Stopping QR Scanner');
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [props, updateContext]);

  return (
    <div>
      <div className="videoWrapper">
        <video className="qrVideo" ref={videoElementRef} />
      </div>
      <p className="scannedText">{scanned}</p>
    </div>
  );
};

export default QRScanner;
