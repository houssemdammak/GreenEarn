import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css'

const FormTwo = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.userDetails;

    const next = () => {
        if (updateContext.binID == null || updateContext.binID.length !== 4) {
            console.log('Please enter the Bin ID correctly')
        } else (updateContext.setStep(updateContext.currentPage + 1))
    };
    
    return (
        <div className="container-home">
            {/* <p>Enter the OTP recieved on your Phone no. <b>{updateContext.userPhone}</b></p> */}
            {/* <img className="otpimg" src="https://ecall-messaging.com/wp-content/uploads/2020/11/eCall_Illustration_mTAN.svg" alt="otp-img" /> */}
            <p>Enter your Bin ID</p>

            <div className="formContain">
                <form className="form">
                    <input className="formInput" type="text" maxLength="4" placeholder="Bin ID" onChange={e => updateContext.setBinID(e.target.value)} required/>
                    <div className="multipleButtons">
                    <button className="multipleButton" value="Previous" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>Previous </button>
                    <button className="multipleButton" value="Next" type="button" onClick={next}>Next </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTwo;