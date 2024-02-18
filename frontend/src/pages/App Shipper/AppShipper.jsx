import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import './AppShipper.css'
import { InputText } from 'primereact/inputtext';
import ProgressBar from "react-percent-bar";
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
  //fetchBins;

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
      <span
        className="p-input-icon-left"
        style={{ display: "flex", alignItems: "center" }}
      >
        
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

    // Calculer la couleur en fonction du pourcentage
    if (percent <= 25) {
        fillColor = `rgb(${Math.round( percent * 3)}, ${Math.round( percent * 4)}, 100)`; // Dégradation douce vers le haut
    } else if (percent <= 50) {
        fillColor = `rgb(${Math.round(201 + (percent - 25) * 1.52)}, ${Math.round(239 - (percent - 25) * 1.6)}, 199)`; // Dégradation plus rapide vers le haut
    } else if (percent <= 75) {
        fillColor = `rgb(${Math.round(201 + (percent - 50) * 0.76)}, ${Math.round(239 - (percent - 50) * 0.8)}, 199)`; // Dégradation douce vers le bas
    } else if (percent <= 95) {
        // Pourcentage supérieur à 75% et inférieur ou égal à 95%
        const remainingPercent = percent - 75; // Pourcentage restant après 75%
        const redComponent = 255 - remainingPercent ; // Calcul de la composante rouge pour un rouge plus doux
        const greenComponent =100+  remainingPercent; // Augmentation de la composante verte pour un rouge plus doux
        fillColor = `rgb(${Math.round(redComponent)}, ${Math.round(greenComponent)}, 100)`; // Rouge plus doux
    } else {
        // Pourcentage supérieur à 95%
        fillColor = "rgb(255, 50, 50)"; // Rouge doux
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





  return (
    <div className='BodyShipper'>
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
            header={header}
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