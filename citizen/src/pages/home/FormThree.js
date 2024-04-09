import React, { useContext, useEffect, useState,useRef } from 'react';
import AppContext from './Context';
import './styles.css';
import AuthContext from '../../contexts/authContext';
import { useWeb3 } from "../../contexts/web3Context";
import { Toast } from "primereact/toast";
import { createWaste } from "../../web3";

//import { toast } from 'react-toastify';

const FormThree = () => {
  const toast = useRef(null);
  const { contract } = useWeb3();
  const {id,WalletID} = useContext(AuthContext);
    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;
    const binContext=myContext.binDetail ;

   
    const addToBin = async (binID, citizenID, weight,BlockchainID,citizenWalletID) => {
      console.log(binID, citizenID, weight,BlockchainID)
        try {
          const blockchainTransactionResult = await createWaste(contract,weight, citizenWalletID,BlockchainID);
          if (blockchainTransactionResult.status === 'accepted') {

          const response = await fetch('/api/wastes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ binID, citizenID, weight,BlockchainID })
          });
      
          if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du déchet à la poubelle');
          }

          const waste = await response.json();
          console.log('success');
          console.log('citizenID:',typeof id)
          //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'wastes Created', life: 3000 });
          return waste;

        }
          else {
          
            console.error('Blockchain transaction failed.');
           // toast.current.show({ severity: 'error', summary: 'Error', detail: 'Blockchain transaction failed. waste creation reverted.', life: 3000 });
          }
        } catch (error) {
          console.error('Error creating wastes:', error);
         // toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create waste.', life: 3000 });
        }
      };
      

      const finish = async () => {
        console.log("updateContext", updateContext);
    
        try {
            const waste = await addToBin(updateContext.binID, id, updateContext.quantity, binContext.BlockchainID, WalletID);
            // Assuming addToBin returns the waste object when the transaction is successful
            console.log("Transaction accepted. Waste created:", waste);
            
            // Update the page after the transaction is completed
            updateContext.setStep(updateContext.currentPage + 1);
        } catch (error) {
            console.error("Error adding to bin:", error);
            // Handle errors if addToBin fails
        }
    }
    
    return (
      <div>
      <Toast ref={toast} />
        <div className="container-home">
            <p>Are you sur to validate ?</p>
            <div className="multipleButtons">
            <button className="multipleButton" value="Previous" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>Previous</button>
            <button className="doneSubmit" onClick={finish}>Done</button>
            </div>
        </div>
      </div>
    );
};

export default FormThree;
