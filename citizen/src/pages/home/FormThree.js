import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css';

const FormThree = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.userDetails;

    const next = () => {
      if (updateContext.walletID == null) {
            console.log('Please fill your wallet ID')
        } else (updateContext.setStep(updateContext.currentPage + 1))
    };

    return (
        <div className="container-home">
            <p>Enter your wallet ID</p>
            <div className="formContain">
                <form className="form">
                    <input className="formInput" type="text" placeholder="Wallet ID" onChange={e => updateContext.setWalletID(e.target.value)} required/>
                    <div className="multipleButtons">
                    <button className="multipleButton" value="Previous" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>Previous </button>
                    <button className="multipleButton" value="Next" type="button" onClick={next}>Next </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormThree;