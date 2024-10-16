import React, { useState } from "react";
import  "./styles.css";
import AppContext from "./Context";
import Form from "./Form";
import FormFinish from "./FormFinish";
import FormThree from "./FormThree";

import NavigationBar from "../../components/navbar";
const StepForm = () => {
  const [BlockchainID, setBlockchainID] = useState(null); // blockchain id de bin
  const [BinID, setBinID] = useState(null);
  const [wasteType, setwasteType] = useState(null);
  const [Quantity, setQuantity] = useState(null);
  const [deposit, setDeposit] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [step, setStep] = useState(0);

  const wasteDetails = {
    //deposit=true si le citizen a valider son choix si nn false
    qrCode:qrCode ,
    deposit:deposit ,
    binID: BinID,
    wasteType: wasteType,
    quantity: Quantity,
    BlockchainID:BlockchainID,
    currentPage: step,
    setBinID,
    setwasteType,setQuantity,
    setDeposit,setBlockchainID,
    setQrCode,setStep
  };
 
  return (
    
    <AppContext.Provider value={{ wasteDetails }}>
      <div className="main">
        <div>
        <NavigationBar />          
        <h4 style={{fontFamily:"Slackey",fontSize:"40px",fontWeight:"normal"}}>GreenEarn Citizens</h4>
        </div>
        <div className="steps">
          <div className="wrapper">
           
            {step === 0 &&  <Form/>} 
            {step === 1 &&  <FormThree/>} 

            {step === 2 && <FormFinish />} 
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default StepForm;
