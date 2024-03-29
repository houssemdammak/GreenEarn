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
  const {id} = useContext(AuthContext);
    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;
   
    const addToBin = async (binID, citizenID, weight) => {
      console.log(binID, citizenID, weight)
        try {
          const blockchainTransactionResult = await createWaste(contract,weight, "0xe6bc3286Fb3778876c4044BA6cFB704415551490","17089293973053443058608115042584247761808000131898204140481830366382155519993");
          if (blockchainTransactionResult.status === 'accepted') {

          const response = await fetch('/api/wastes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ binID, citizenID, weight })
          });
      
          if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du déchet à la poubelle');
          }

          const waste = await response.json();
          console.log('success');
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
      

    const finish = () => {
        console.log(updateContext);
        updateContext.setStep(updateContext.currentPage +1)
        addToBin(updateContext.binID,id,updateContext.quantity)

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
