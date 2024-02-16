import React, { useContext, useEffect, useState } from 'react';
import AppContext from './Context';
import './styles.css';
import AuthContext from '../../contexts/authContext';
const FormThree = () => {
  const {id} = useContext(AuthContext);
    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;
   
    const addToBin = async (binID, citizenID, weight) => {
      console.log(binID, citizenID, weight)
        try {
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
      
          return waste;
        } catch (error) {
          throw new Error(error.message);
        }
      };
      

    const finish = () => {
        console.log(updateContext);
        updateContext.setStep(updateContext.currentPage +1)
        addToBin(updateContext.binID,id,updateContext.quantity)

    }
    return (
        <div className="container-home">
            <p>Are you sur to validate ?</p>
            <div className="multipleButtons">
            <button className="multipleButton" value="Previous" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>Previous</button>
            <button className="doneSubmit" onClick={finish}>Done</button>
            </div>
        </div>
    );
};

export default FormThree;
