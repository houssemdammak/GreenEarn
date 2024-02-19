import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import ProgressBar from "react-percent-bar";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../images/EarnGreen Icons/icon_black.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import './AppShipper.css';

function ShipperApp() {
  const [products, setProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const fetchBins = async () => {
    const response = await fetch('/api/bins')
    const products = await response.json()
    setProducts(products)
    console.log(products)
  }

  const fetchBinsCalled = useRef(false);

  useEffect(() => {
    if (!fetchBinsCalled.current) {
      fetchBins();
      fetchBinsCalled.current = true;
    }
  }, [fetchBinsCalled]);

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
  if (products !== null) {
    productsWithIndex = products.map((product, index) => ({ ...product, index: products.length - index }));
  }

  const statusBodyTemplate = (rowData) => {
    const percent = (rowData.currentWeight / rowData.capacity) * 100;
    const mainColor = "rgb(201, 239, 199)";
    let fillColor;

    // Calculate color based on percentage
    if (percent <= 25) {
        fillColor = `rgb(${Math.round( percent * 3)}, ${Math.round( percent * 4)}, 100)`; // Gentle gradient upwards
    } else if (percent <= 50) {
        fillColor = `rgb(${Math.round(201 + (percent - 25) * 1.52)}, ${Math.round(239 - (percent - 25) * 1.6)}, 199)`; // Faster gradient upwards
    } else if (percent <= 75) {
        fillColor = `rgb(${Math.round(201 + (percent - 50) * 0.76)}, ${Math.round(239 - (percent - 50) * 0.8)}, 199)`; // Gentle gradient downwards
    } else if (percent <= 95) {
        const remainingPercent = percent - 75;
        const redComponent = 255 - remainingPercent;
        const greenComponent = 100 + remainingPercent;
        fillColor = `rgb(${Math.round(redComponent)}, ${Math.round(greenComponent)}, 100)`; // Softer red
    } else {
        fillColor = "rgb(255, 50, 50)"; // Softer red
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProgressBar
            percent={percent}
            fillColor={fillColor}
            width="100px"
            height="15px"
        />
        <span style={{ marginLeft: '5px' }}>{`${Math.round(percent)}%`}</span>
      </div>
    );
  };

  const Navbar = ({ userName, handleLogout }) => {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo }style={{width: '200px', height:'45px'}}  alt="Logo" className="logo" />
        </div>
        <div className="navbar-items">
          <div className="navbar-user">
            <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
            <span className="user-name">{userName}Houssem</span>
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
            <Column field="type" header="Type" sortable style={{ minWidth: '12rem' }}></Column>
            <Column field="location" header="Location" sortable style={{ minWidth: '16rem' }}></Column>
            <Column field="status" header="Status" body={statusBodyTemplate} style={{ minWidth: '16rem' }}></Column>
            <Column field="capacity" header="Capacity (Kg)" sortable style={{ minWidth: '16rem' }}></Column>
            <Column field="currentWeight" header="Current Weight (Kg)" sortable style={{ minWidth: '16rem' }}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default ShipperApp;
