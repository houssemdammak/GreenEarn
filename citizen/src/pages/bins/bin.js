import React, { useState, useEffect, useRef } from 'react';
import "./bin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import NavigationBar from '../../components/navbar'
import AuthContext from '../../contexts/authContext';
import { useContext } from 'react';
function BinDemo() {
  const {id } = useContext(AuthContext);

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
 if (products !== null && typeof products === 'object') {
  Object.values(products).reverse().forEach((product, index) => {
    productsWithIndex.push({ ...product, index: 1 + index });
  });
}
  return (
<>
<NavigationBar />

      <Toast ref={toast} />
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
          </DataTable>

        </div>
      </div>


    </>
  );
}
export default BinDemo;