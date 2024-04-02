import React, { useContext, useState } from 'react';
import AppContext from './Context';
import './styles.css';

const FormTwo = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;
    const binContext=myContext.binDetail

    const [capacityError, setCapacityError] = useState("");
    const [Error, setError] = useState(false);
    // useEffect(() => {
    //     console.log(updateContext.wasteType)
    //     console.log(updateContext.wasteType.quantity);
    //     console.log(binContext)
    //   });

      const next = () => {
        let hasError = false;

        if (!updateContext.quantity) {
            setCapacityError("Please enter the quantity");
            hasError = true;
        } else if (Number(updateContext.quantity) + binContext.currentweight > binContext.capacity) {
            setCapacityError("Quantity exceeds bin capacity");
            hasError = true;
        }

        setError(hasError);

        if (!hasError) {
            updateContext.setStep(updateContext.currentPage + 1);
        }
    };

    return (
        <div className="container-home">
            <p>Enter your waste details</p>
            <div className="formContainer">
                <form className="form">
                    <label>{updateContext.wasteType}</label>
                    <input className="formInput" type="text" placeholder="Quantity in kg"
                    value={updateContext.quantity !== null ? updateContext.quantity : ''} 
                     onChange={e => updateContext.setQuantity(e.target.value)} />
                    {Error && <span className="errorText">{capacityError}</span>}
                    <div className="multipleButtons">
                    <button className="multipleButton" value="Previous" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>Previous</button>

                        <button className="multipleButton" value="Next" type="button" onClick={next}>Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTwo;
