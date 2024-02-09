import React, { useState } from "react";
import  "./styles.css";
import AppContext from "./Context";
import FormTwo from "./FormTwo";
import FormOne from "./FormOne";
import FormThree from "./FormThree";
import FormFinish from "./FormFinish";
import ProgressBar from "./ProgressBar";
import icon from "../../images/icon_black.png";
import NavigationBar from "../../components/navbar";
const StepForm = () => {
  const [step, setStep] = useState(0);
  const [BinID, setBinID] = useState(null);
  const [wasteType, setwasteType] = useState(null);
  const [Quantity, setQuantity] = useState(null);
  const [walletId, setWalletID] = useState(null);

  const userDetails = {
    currentPage: step,
    binID: BinID,
    wasteType: wasteType,
    quantity: Quantity,
    walletID: walletId,
    setStep,
    setBinID,
    setwasteType,
    setQuantity,
    setWalletID,
  };

  return (
    
    <AppContext.Provider value={{ userDetails }}>
      <div className="main">
        <div>
        <NavigationBar />
          <img
            src={icon}
            style={{ width: "350px", height: "50px", marginTop: "20px" }}
            alt="register"
          />
        </div>
        <div className="steps">
          <div className="wrapper">
            <ProgressBar />
            {step === 0 && <FormOne />}
            {step === 1 && <FormTwo />}
            {step === 2 && <FormThree />}
            {step === 3 && <FormFinish />}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default StepForm;
