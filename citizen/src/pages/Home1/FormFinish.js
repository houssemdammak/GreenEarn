import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css';
import { useNavigate} from "react-router-dom";

const FormFinish = () => {

    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;

    const navigate = useNavigate();
    const finish = () => {
        console.log(updateContext);
        navigate("/")
        updateContext.setStep(0)
        updateContext.setBinID(null);
        updateContext.setwasteType(null);
        updateContext.setQuantity(null);
    }
    return (
        <div className="container-home">
            {updateContext.deposit ? (
                // Cas où le dépôt est accepté
                <>
                    <p>Successfully Submitted</p>
                    <p>Thank you, The waste is deposed and waiting for shipment</p>
                    <p>Once the waste is recycled, you will receive your reward</p>
                    <img style={{marginTop: "15px"}} className="done" src="https://www.svgrepo.com/show/13650/success.svg" alt="successful" />
                    <button className="doneSubmit" onClick={finish}>Done</button>
                </>
            ) : (
                // Cas où le dépôt est rejeté
                <>
                    <p>Submission Unsuccessful</p>
                    <p>Unfortunately, your waste deposit has been rejected.</p>
                    <p>Please try again.</p>
                    <img style={{marginTop: "15px"}} className="done" src="https://www.svgrepo.com/show/499977/brake-system-failure.svg" alt="unsuccessful" />
                    <button className="undoneSubmit" onClick={finish}>Retry</button>
                </>
            )}
        </div>
    );
    
};

export default FormFinish;
