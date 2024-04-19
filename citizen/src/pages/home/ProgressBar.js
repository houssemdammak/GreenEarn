import React, { useContext } from 'react';
import AppContext from './Context';

const ProgressBar = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.wasteDetails;

    const percent = updateContext.currentPage * 135; // chaque progression avec 135px
    const percentage = updateContext.currentPage;

    // Couleur de fond de la barre de progression
    const background = {
        backgroundColor: '#dee2e6',
        height: 8,
        width: 400,
        borderRadius: 20,
    };

    // Couleur de la progression conditionnée en fonction de deposit
    const progress = {
        backgroundColor: (updateContext.currentPage === 3 && !updateContext.deposit) ? '#ed7c84' : '#43aa8b',
        height: 8,
        width: percent,
        borderRadius: 20,
    };
    
    
    // Couleur du texte conditionnée en fonction de deposit
    const text = {
        fontSize: 12,
        color: updateContext.step === 3 ?
            (updateContext.deposit ? '#ed7c84' : '#8d99ae') :
            '#8d99ae',
    };
    
    

    return (
        <div>
            <p style={text}>{percentage} of 3 completed</p>
            <div style={background}>
                <div style={progress}></div>
            </div>
        </div>
    );
};

export default ProgressBar;
