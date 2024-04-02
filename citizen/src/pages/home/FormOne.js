import React, { useContext, useState } from 'react';
import AppContext from './Context';
import './styles.css';

const FormOne = () => {
    const myContext = useContext(AppContext);

    const updateContext = myContext.wasteDetails;
    const binContext=myContext.binDetail ;
    const [binIdError, setBinIdError] = useState(false);

    const getBindetail = async () => {
        try {
            const response = await fetch(`/api/bins/${updateContext.binID}`);
            const products = await response.json();
            
            console.log(products);
            console.log("blockChainID :",binContext.BlockchainID);
            return products;
        } catch (error) {
            console.error('Error fetching bin details:', error);
            return null;
        }
    };

    const next = async () => {
        if (updateContext.binID == null) {
            console.log('Please enter the Bin ID correctly');
            setBinIdError(true);
        } else {
            try {
                const products = await getBindetail();
                if (!products.error) {
                    updateContext.setwasteType(products.type);
                    updateContext.setBinID(products._id)
                    binContext.setType(products.type)
                    binContext.setcurrentweight(products.currentWeight)
                    binContext.setCapacity(products.capacity)
                    setBinIdError(false);
                    updateContext.setStep(updateContext.currentPage + 1);
                    binContext.setBlockchainID(products.BlockchainID)

                }else {
                    console.log('No bin details found');
                    setBinIdError(true);
                }              
                
            } catch (error) {
                console.error('Error getting bin details:', error);
                setBinIdError(true);
            }
        }
    };

    return (
        <div className="container-home">
            <p>Enter your Bin ID</p>
            <div className="formContain">
                <form className="form">
                    <input
                        className="formInput"
                        type="text"
                        maxLength="24"
                        placeholder="Bin ID"
                        value={updateContext.binID || ""}
                        onChange={e => updateContext.setBinID(e.target.value)}
                        required
                    />
                    {binIdError && <span className="errorText">Please enter a valid Bin ID</span>}
                    <div className="multipleButtons">
                        <button className="multipleButton" value="Next" type="button" onClick={next}>Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormOne;
