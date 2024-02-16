import React, { useState, useEffect, useRef } from 'react';
import "./bin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import NavigationBar from '../../components/navbar'
import AuthContext from '../../contexts/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
function BinDemo() {
  const {id } = useContext(AuthContext);
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  // const [IDError, setIDError] = useState('');
  const [products, setProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  useEffect(() => {
    const fetchWasteByCitizen = async () => {
      const response = await fetch(`/api/wastes/${id}`);
      const products = await response.json()
      setProducts(products)
      console.log(products)
    }
    fetchWasteByCitizen()
  }, []);
 let productsWithIndex = [];
 console.log(productsWithIndex )
 if (products !== null && typeof products === 'object' && products.error=="") {
  Object.values(products).reverse().forEach((product, index) => {
    productsWithIndex.push({ ...product, index: 1 + index });
  });
}

  return (
<>
<NavigationBar />

      <Toast ref={toast} />
      
 
    {productsWithIndex.length > 0 ? (
      <div className="card">
       <div className="DataTableContainer">
      <DataTable
        ref={dt}
        value={productsWithIndex}
        className='DataTable'
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        globalFilter={globalFilter}
        // header={header}
      >
        <Column field="index" header="Num" sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="type" header="Type" sortable style={{ minWidth: '12rem' }}></Column> 
        <Column field="status" header="Status" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="location" header="Location" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="weight" header="Weight (Kg)" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="dateAdded" header="Date" sortable style={{ minWidth: '16rem' }}></Column> 
        {/* <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> */}
      </DataTable></div>  
</div>
    ) : (
      <div className="no-waste-message">
      <div className="error-container">
        <FontAwesomeIcon icon={faExclamationCircle} className="not-found-icon" size="4x" />
        <span className="message-text">You didn't deposit any waste.</span>
      </div>
    </div>
    )}




    </>
  );
}
export default BinDemo;