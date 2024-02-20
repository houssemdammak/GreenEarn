import React, { useState, useEffect, useRef,useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import ProgressBar from "react-percent-bar";

import logo from '../../images/EarnGreen Icons/icon_black.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../contexts/authSlice';
import './AppShipper.css';

function ShipperApp() {
  const {id, name ,logout } = useContext(AuthContext);

  const [collections, setCollections] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const fetchCollection = async () => {
    const response = await fetch(`/api/shippers/getCollection/${id}`);
    const collection = await response.json()
    setCollections(collection)
    console.log(collection)
  }

  const fetchCollectionCalled = useRef(false);

  useEffect(() => {
    if (!fetchCollectionCalled.current) {
      fetchCollection();
      fetchCollectionCalled.current = true;
    }
  }, [fetchCollectionCalled]);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Bins</h4>
      <span className="p-input-icon-left" style={{ display: "flex", alignItems: "center" }}>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  let productsWithIndex = [];
  if (collections !== null) {
    productsWithIndex = collections.map((product, index) => ({ ...product, index: collections.length - index }));
  }

  const handleLogout = () => {
    logout()
  }
  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
        </React.Fragment>
    );
};
  const formatDate = (dateString) => {
    // Convertir la date de type string en objet Date
    const date = new Date(dateString);
    
    // Formater la date en JJ/MM/AAAA
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Formater l'heure en HH:MM
    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Combinaison de la date et de l'heure formatées
    return `${formattedDate} ${formattedTime}`;
  };
  const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo }style={{width: '200px', height:'45px'}}  alt="Logo" className="logo" />
        </div>
        <div className="navbar-items">
          <div className="navbar-user">
          <span className="user-name">{name}</span>
            <FontAwesomeIcon icon={faUserCircle} className="user-icon"></FontAwesomeIcon> 
            <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" onClick={handleLogout} />
          </div>
        </div>
      </nav>
    );
  };
  return (
    <div className='BodyShipper'>
    <Navbar/>
      <Toast ref={toast} />
      <div className="cardShipper">
        <div className="DataTableContainer">
          <DataTable
            ref={dt}
            value={productsWithIndex}
            className='DataTableShipper'
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
          >
            <Column field="index" header="Num" sortable style={{ minWidth: '12rem' }}></Column>
            <Column field="binID.type" header="Type" sortable style={{ minWidth: '12rem' }}></Column>
            <Column field="binID.location" header="Location" sortable style={{ minWidth: '16rem' }}></Column>
            <Column field="createdAt" header="Date" sortable style={{ minWidth: '16rem' }} body={(rowData) => formatDate(rowData.createdAt)}
/>          <Column field="binID.capacity" header="Capacity (Kg)" sortable style={{ minWidth: '16rem' }}></Column>
            {/* <Column field="binID.currentWeight" header="Current Weight (Kg)" sortable style={{ minWidth: '16rem' }}></Column> */}
            
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default ShipperApp;
