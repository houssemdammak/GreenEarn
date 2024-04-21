import React, { useState } from "react";
import  "./styles.css";
import AppContext from "./Context";
import FormOne from "./FormOne";
import FormThree from "./FormThree";
import FormFinish from "./FormFinish";
import FormTwo from "./FormTwo";
import ProgressBar from "./ProgressBar";
import NavigationBar from "../../components/navbar";
const StepForm = () => {
  const [BlockchainID, setBlockchainID] = useState(null); // blockchain id de bin
  const [step, setStep] = useState(0);
  const [BinID, setBinID] = useState(null);
  const [wasteType, setwasteType] = useState(null);
  const [Quantity, setQuantity] = useState(null);
  const [deposit, setDeposit] = useState(false);
////////////////////////
const [capacity, setCapacity] = useState(null);
const [type, setType] = useState(null);
const [currentWeight, setcurrentweight] = useState(null);

/////////////
  const wasteDetails = {
    //deposit=true si le citizen a valider son choix si nn false
    deposit:deposit ,
    currentPage: step,
    binID: BinID,
    wasteType: wasteType,
    quantity: Quantity,
    setStep,
    setBinID,
    setwasteType,
    setQuantity,setDeposit
  };
  const binDetail ={
    capacity:capacity ,
    type:type ,
    currentweight:currentWeight,
    BlockchainID:BlockchainID,
    setType,setCapacity,setcurrentweight,setBlockchainID

  }
  return (
    
    <AppContext.Provider value={{ wasteDetails,binDetail }}>
      <div className="main">
        <div>
        <NavigationBar />          
        <h4 style={{fontFamily:"Slackey",fontSize:"40px",fontWeight:"normal"}}>GreenEarn Citizens</h4>
        </div>
        <div className="steps">
          <div className="wrapper">
            <ProgressBar />
            {step === 0 && <FormOne />}
            {step === 1 && <FormTwo/>}
            {step === 2 && <FormThree />}
            {step === 3 && <FormFinish />} 
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default StepForm;
