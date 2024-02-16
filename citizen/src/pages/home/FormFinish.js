import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css';
import { useNavigate} from "react-router-dom";

const FormFinish = () => {

    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;
    const binContext=myContext.binDetail ;

    const navigate = useNavigate();

    const finish = () => {
        console.log(updateContext);
        navigate("/")
        updateContext.setStep(0)
        updateContext.setBinID(null);
        updateContext.setwasteType(null);
        updateContext.setQuantity(null);
        binContext.setType(null);
        binContext.setCapacity(null);
        binContext.setcurrentweight(null);
    }
    return (
        <div className="container-home">
            <p>Successfully Submitted</p>
            <p>Thank you, The waste is deposed and waiting for shippment</p>
            <p>Once the waste is recycled you will receive your reward</p>
            <img style={{marginTop:"15px"}} className="done" src="https://www.svgrepo.com/show/13650/success.svg" alt="successful" />
            
            <button className="doneSubmit" onClick={finish}>Done</button>
            
        </div>
    );
};

export default FormFinish;
