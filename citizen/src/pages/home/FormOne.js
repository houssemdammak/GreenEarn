import React, {useContext} from 'react';
import AppContext from './Context';
import './styles.css';

const FormOne = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.userDetails;

    const next = () => {
        if (updateContext.wasteType == null) {
            console.log('Please select the types')
        } else if (updateContext.quantity == null) {
            console.log('Enter the Quantity in Kg')
        } else (updateContext.setStep(updateContext.currentPage + 1))
    };

    return (
        <div className="container-home">
            <p>Enter your waste details</p>
            <div className="formContainer">
                <form className="form">
                    <label>
                    <select className="formSelect" onChange={e => updateContext.setwasteType(e.target.value)} >
                        <option >Select Type of waste</option>
                        <option value="Medical">Medical</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Plastic">Plastic</option>
                    </select>
                    </label>
                    <input className="formInput" type="text" placeholder="Quantity in kg" onChange={e => updateContext.setQuantity(e.target.value)} />
                    <div className="multipleButtons">
                    <button className="multipleButton" value="Next" type="button" onClick={next}>Next </button>

                        {/* <button type="button" className="formSubmit" onClick={next}>Next </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormOne;