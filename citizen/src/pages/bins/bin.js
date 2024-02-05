import React, { useState, useEffect, useRef } from 'react';
import "./bin.css";
import NavigationBar from "../../components/navbar";

import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
function BinDemo() {
  let emptyProduct = {
    type: '',
    status: 'Empty',
    location: '',
    capacity: '',
    currentWeight: '0',
  };
  let emptyProductUpdate = {
    type: '',
    status: 'Empty',
    location: '',
    capacity: '',
    currentWeight: '0',
  };
  // const [IDError, setIDError] = useState('');
  const [capacityError, setcapacityError] = useState('');
  const [currentWeightError, setCurrentWeightError] = useState('');
  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);

  const [productDialogUpdate, setProductDialogUpdate] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
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


  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
    
  };




  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setProductDialogUpdate(false);
  };


  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);
    const isValidCapacity = product.capacity !== null && product.capacity > 0;
    const capacityError = !isValidCapacity ? "Capacity must be a number greater than 0." : '';

    // Validate currentWeight
    const isValidCurrentWeight = product.currentWeight !== '' && product.currentWeight < product.capacity;
    const currentWeightError = !isValidCurrentWeight ? " Current Weight should be less than the capacity " : '';

    if (
      isValidCapacity &&
      isValidCurrentWeight &&
      product.type.trim() !== '' &&
      product.status.trim() !== '' &&
      product.location.trim() !== ''
      //product.currentWeight.toString().trim() !== ''
    ) {

      let _products = [...products];
      let _product = { ...product };
    //   const index = findIndexById(_product._id);
      setProductDialog(false);
      setcapacityError('');
      setCurrentWeightError('');
      setProducts(_products);

      
        
        try {
          const response = await fetch('/api/bins/', {
            method: 'POST',
            body: JSON.stringify(_product),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          _products.push(_product);
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bin Created', life: 3000 });
          //console.log(_product)
          // const responseData = await response.json();
          fetchBins();

          // console.log('Réponse de l\'API:', responseData);
        } catch (error) {
          console.error('Erreur lors de l\'envoi des données à l\'API:', error);
        }
      
          setcapacityError('');
          setCurrentWeightError('');
          setProducts(_products);
          setProductDialog(false);
          setProduct(emptyProduct);
    } else {
      // Mise à jour de l'état d'erreur pour chaque champ
      //setIDError(idError);
      setcapacityError(capacityError);
      setCurrentWeightError(currentWeightError);
    }
  };

  //Check if products is not null before getting its length



  const saveUpdatedProduct = async () => {
    setSubmitted(true);
    const isValidCapacity = product.capacity !== null && product.capacity > 0;
    const capacityError = !isValidCapacity ? "Capacity must be a number greater than 0." : '';

    // Validate currentWeight
    const isValidCurrentWeight = product.currentWeight !== '' && product.currentWeight <= product.capacity;
    const currentWeightError = !isValidCurrentWeight ? " Current Weight is required and it should be less than the capacity " : '';
    if (
      isValidCapacity &&
      isValidCurrentWeight &&
      product.type.trim() !== '' &&
      product.status.trim() !== '' &&
      product.location.trim() !== ''
      //product.currentWeight.toString().trim() !== ''
    ) {

      let _products = [...products];
      let _product = { ...product };

      const index = findIndexById(_product._id);
      setProductDialogUpdate(false);
      setcapacityError('');
      setCurrentWeightError('');
      setProducts(_products);

      if (index !== -1) {

        try {
          // Utilisation de la méthode PATCH pour mettre à jour partiellement la ressource
          const response = await fetch(`/api/bins/${_product._id}`, {
            method: 'PATCH',
            body: JSON.stringify(_product),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            _products[index] = _product;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bin Updated', life: 3000 });
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du Bin:', error);
        }
      } else {

        try {
          const response = await fetch('/api/bins/', {
            method: 'POST',
            body: JSON.stringify(_product),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          _products.push(_product);

          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bin Created', life: 3000 });
          //console.log(_product)
          // const responseData = await response.json();
          fetchBins();

          // console.log('Réponse de l\'API:', responseData);
        } catch (error) {
          console.error('Erreur lors de l\'envoi des données à l\'API:', error);
        }
      }
      setcapacityError('');
      setCurrentWeightError('');
      setProducts(_products);
      setProductDialogUpdate(false);
      setProduct(emptyProductUpdate);
    } else {
      // Mise à jour de l'état d'erreur pour chaque champ
      //setIDError(idError);
      setcapacityError(capacityError);
      setCurrentWeightError(currentWeightError);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialogUpdate(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    try {
      const response = await fetch(`/api/bins/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        let _products = products.filter((val) => val._id !== product._id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'in Deleted', life: 3000 });
      } else {
        console.error('Failed to delete Shipper. Server returned:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting Bin:', error.message);
    }
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          style={{ backgroundColor: '#454545', color: 'white', border: '#001d66' }}

          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };
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
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const productDialogUpdateFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Update" icon="pi pi-check" onClick={saveUpdatedProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );


  let productsWithIndex = [];
  if (products !== null) {
    productsWithIndex = products.map((product, index) => ({ ...product, index: products.length - index }));
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
            <Column field="capacity" header="Capacity (Kg)" sortable style={{ minWidth: '16rem' }}></Column>
            <Column field="currentWeight" header="Current Weight (Kg)" sortable style={{ minWidth: '16rem' }}></Column>
            {/* <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> */}
          </DataTable>

        </div>
      </div>

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Bin Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

        <div className="field">
          <label htmlFor="type" className="font-bold">Type</label>
          <Dropdown
            id="type"
            value={product.type}
            options={['Plastic', 'Medical', 'Electronic']}
            onChange={(e) => onInputChange(e, 'type')}
            required
            placeholder="Select Type"
          />
          {submitted && !product.type && <small className="p-error">Type is required.</small>}
        </div>

        <div className="field">
          <label htmlFor="location" className="font-bold">Location</label>
          <InputText
            id="location"
            value={product.location}
            onChange={(e) => onInputChange(e, 'location')}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !product.location })}
          />
          {submitted && !product.location && <small className="p-error">Location is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="capacity" className="font-bold">Capacity</label>
          <InputText
            id="capacity"
            value={product.capacity}
            onChange={(e) => onInputChange(e, 'capacity')}
            required
            className={classNames({ 'p-invalid': submitted && (!product.capacity || capacityError) })}
            min={1}
          />
          {submitted && (!product.capacity || capacityError) && (
            <small className="p-error">Capacity must be a number greater than 0.</small>
          )}
        </div>

      </Dialog>



      {/* Update Dialog */}
      <Dialog visible={productDialogUpdate} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Bin Details" modal className="p-fluid" footer={productDialogUpdateFooter} onHide={hideDialog}>

        <div className="field">
          <label htmlFor="type" className="font-bold">Type</label>
          <Dropdown
            id="type"
            value={product.type}
            options={['Plastic', 'Medical', 'Electronic']}
            onChange={(e) => onInputChange(e, 'type')}
            required
            placeholder="Select Type"
          />
          {submitted && !product.type && <small className="p-error">Type is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="status" className="font-bold">Status</label>
          <Dropdown
            id="status"
            value={product.status}
            options={['Empty', 'Partially Filled', 'Half-Filled', 'Almost Full', 'Full']}
            onChange={(e) => onInputChange(e, 'status')}
            required
            placeholder="Select Status"
          />
          {submitted && !product.status && <small className="p-error">Status is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="location" className="font-bold">Location</label>
          <InputText
            id="location"
            value={product.location}
            onChange={(e) => onInputChange(e, 'location')}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !product.location })}
          />
          {submitted && !product.location && <small className="p-error">Location is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="capacity" className="font-bold">Capacity</label>
          <InputText
            id="capacity"
            value={product.capacity}
            onChange={(e) => onInputChange(e, 'capacity')}
            required
            className={classNames({ 'p-invalid': submitted && (!product.capacity || capacityError) })}
            min={1}
          />
          {submitted && (!product.capacity || capacityError) && (
            <small className="p-error">Capacity must be a number greater than 0.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="currentWeight" className="font-bold">Current Weight</label>
          <InputText
            id="currentWeight"
            value={product.currentWeight}
            onChange={(e) => onInputChange(e, 'currentWeight')}
            required
            className={classNames({ 'p-invalid': submitted && !product.currentWeight })}
          />
          {submitted &&( !product.currentWeight && product.currentWeight!=='0')&& <small className="p-error">Current Weight is required.</small>}
          {currentWeightError &&currentWeightError !=="" && <small className="p-error">{currentWeightError}</small>}
        </div>
      </Dialog>


      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Are you sure you want to delete <b>Bin Num {product.index}</b>?
            </span>
          )}
        </div>
      </Dialog>


    </>
  );
}
export default BinDemo;