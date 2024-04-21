import React, { useContext, useEffect, useState,useRef } from 'react';
import AppContext from './Context';
import './styles.css';
import AuthContext from '../../contexts/authContext';
import { useWeb3 } from "../../contexts/web3Context";
import { Toast } from "primereact/toast";
import { createWaste } from "../../web3";
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
          updateContext.setDeposit(true)

          //console.log('success');
          //console.log('citizenID:',typeof id)
          //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'wastes Created', life: 3000 });
          return true;

        }
          else {
            
            console.error('Blockchain transaction failed.');
            updateContext.setDeposit(false)
            return false;
           // toast.current.show({ severity: 'error', summary: 'Error', detail: 'Blockchain transaction failed. waste creation reverted.', life: 3000 });
          }
        } catch (error) {
          updateContext.setDeposit(false)

          console.error('Error creating wastes:', error);
          return false;
        }
      };
      

      const finish = async () => {
        console.log("updateContext", updateContext.currentPage);
    
        try {
            const result = await addToBin(updateContext.binID, id, updateContext.quantity, binContext.BlockchainID, WalletID);            
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
