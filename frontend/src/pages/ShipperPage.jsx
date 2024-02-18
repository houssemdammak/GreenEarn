import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
 function ShipperDemo() {
  let emptyProduct = {
    ID: '',
    FullName: '',
    Location: '',
    TelephoneNum: '',
     email: "",
    password:"" ,
};
  /*------------------------errors sets--------------------------------*/
    const [EmailErrorExist, setEmailErrorExist] = useState("");
    const [passwordError, setpasswordError] = useState("");
    const [confirmpasswordError, setconfirmpasswordError] = useState("");
    /*------------------------------------------------------------------*/
    const [IDError, setIDError] = useState('');
    const [IDErrorExist, setIDErrorExist] = useState('');
    const [IDErrorExistUpdate, setIDErrorExistUpdate] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [productDialogUpdate, setProductDialogUpdate] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const fetchShippers =async()=>{
      const response= await fetch('/api/shippers')
      const products= await response.json()
      setProducts(products)
      console.log(products)

  }
  //fetchShippers();
  const fetchShippersCalled = useRef(false);
  useEffect(() => {
    if (!fetchShippersCalled.current) {
      fetchShippers();
      fetchShippersCalled.current = true;
    }
  }, [fetchShippersCalled]);
  

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setProductDialogUpdate(false);
        setIDError("");
        setIDErrorExistUpdate("");
        setIDErrorExist("");
        setPhoneNumberError("");
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }; 
    
    const isPasswordStrong = (password) => {
      // Vérifier la force du mot de passe en fonction de certains critères
      // Vous pouvez modifier ces critères en fonction de vos besoins
      const regexStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regexStrong.test(password);
    };
    const saveProduct = async() => {
      setSubmitted(true);
      let _products = [...products];
      let _product = { ...product };
      /*------------------------- email check -------------------------*/
      const index2 = findIndexByEmail(_product.email);
      const isExistEmail = index2 !== -1;
      const isExistEmailError = isExistEmail ? "Email already exist ." : "";
          //verifier le password confirm 
      const confirmationpass =(product.confirmpassword == product.password) 
      //password not strong 
    
      const validatePassword=isPasswordStrong(_product.password) ;
      /* ------------------------------------------------------------------------ */
      const index = findIndexById(_product.ID);
      const isValidID = /^[a-zA-Z0-9]{8}$/.test(product.ID);
      const isExistID= index !==-1 ;
      const isExistIDError=isExistID ? 'ID Card already exist .' : '';
      const isValidPhoneNumber = /^\d{8}$/.test(product.TelephoneNum);
      const idError = !isValidID ? 'ID Card should be 8 digits.' : '';
      const phoneNumberError = !isValidPhoneNumber ? 'Telephone Number should be 8 digits.' : '';
      if ( validatePassword && confirmationpass &&isExistEmailError ==""  && product.email.trim() !== ""&& product.confirmpassword.trim() !== "" &&product.password.trim() !==""&&
        isValidID && !isExistID && isValidPhoneNumber && product.ID.trim() !== '' 
        && product.FullName.trim() && product.Location.trim() && product.TelephoneNum.toString().trim() !== ''){            
          try {

                  delete _product.confirmpassword;

                  const response = await fetch('/api/shippers', {
                      method: 'POST',
                      body: JSON.stringify(_product),
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  });
                  _products.push(_product);
              toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Shipper Created', life: 3000 });
                  console.log(_product)
                  // const responseData = await response.json();
                  // console.log('Réponse de l\'API:', responseData);
              } catch (error) {
                  console.error('Erreur lors de l\'envoi des données à l\'API:', error);
              }
              fetchShippers();
              setIDError('');
              setIDErrorExist('');
              setPhoneNumberError('');
              setIDErrorExistUpdate('')
              setProducts(_products);
              setProduct(emptyProduct);
              setEmailErrorExist("");setconfirmpasswordError("");setpasswordError("") ;
              setProductDialog(false);
          
      }else {
        if(!validatePassword){
          setpasswordError("Please enter a strong password")
        }
        if(!confirmationpass){
          setconfirmpasswordError("Please confirm your password")
        }
         if(isExistEmailError !=""){
           setEmailErrorExist(isExistEmailError);
         }
        // Mise à jour de l'état d'erreur pour chaque champ
        
        if(!isValidID ){
          setIDError(idError);
          setIDErrorExistUpdate('')
        }
        if(isExistID){
          setIDErrorExistUpdate(isExistIDError);
          setIDError('');
        }
        setPhoneNumberError(phoneNumberError);
    }
  };
  const saveUpdatedProduct = async() => {
    setSubmitted(true);
    let _products = [...products];
    let _product = { ...product };
    const index2 = findIndexByEmail(_product.email);
    const indexDB = findIndexBy_id(_product._id);
    const isTheSameEmail = _product.email ==_products[indexDB].email;
    const isExistEmailError = index2 !== -1 && !isTheSameEmail;
    const index = findIndexById(_product.ID);
    const isTheSameID = _product.ID ==_products[indexDB].ID;
    const isExistID = index !== -1 && !isTheSameID;
    const isExistIDError=isExistID ? 'ID Card already exist .' : '';
    const isValidID = /^[a-zA-Z0-9]{8}$/.test(product.ID);
    const isValidPhoneNumber = /^\d{8}$/.test(product.TelephoneNum);
    const idError = !isValidID ? 'ID should be 8 digits.' : '';
    const phoneNumberError = !isValidPhoneNumber ? 'Telephone Number should be 8 digits.' : '';
    if ( isValidID && isValidPhoneNumber &&
      !isExistEmailError  &&
      product.email.trim() !== "" &&
      product.ID.trim() !== '' &&
      product.FullName.trim() &&
      product.Location.trim() &&
     !isExistID &&  
      product.TelephoneNum.toString().trim() !== '')
      {        
        setProductDialog(false);    
        delete product.confirmpassword 
        delete product.password        
        try {
              // Utilisation de la méthode PATCH pour mettre à jour partiellement la ressource
              //console.log(_product._id)
              //console.log(_product.ID)
              const response = await fetch(`/api/shippers/${_product._id}`, {
                  method: 'PATCH',
                  body: JSON.stringify(_product),
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }); 
              if (response.ok) {
                  _products[indexDB] = _product;
                  toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Shipper Updated', life: 3000 });
              } 
          } catch (error) {
              console.error('Erreur lors de la mise à jour du Shipper:', error);
          }
          setProductDialogUpdate(false);
          //fetchShippers();
          setIDError('');
          setEmailErrorExist("");
          setPhoneNumberError('');
          setProducts(_products);
          setIDErrorExistUpdate('');
          setconfirmpasswordError("");
          setpasswordError("") ;

     }else {
      if(isExistEmailError !=""){
        setEmailErrorExist("Email already exist .");
      }
      // Mise à jour de l'état d'erreur pour chaque champ
     
      if( !isValidID ){
        setIDError(idError);
        setIDErrorExistUpdate('')
      }
      if(isExistID){
        setIDErrorExistUpdate(isExistIDError);
        setIDError('');
      }
      setPhoneNumberError(phoneNumberError);
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

    const deleteProduct = async() => {
      try {
          const response = await fetch(`/api/shippers/${product._id}`, {
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
              toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Shipper Deleted', life: 3000 });
          } else {
              console.error('Failed to delete Shipper. Server returned:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Error deleting Shipper:', error.message);
      }
  }; 

  
    const findIndexByEmail = (email) => {
      let index = -1;

      for (let i = 0; i < products.length; i++) {
        if (products[i].email === email) {
          index = i;
          break;
        }
      }

      return index;
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].ID === id) {
                index = i;
                break;
            }
        }

        return index;
    };  

    
  const findIndexBy_id = (id) => {
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
      setSubmitted(false);
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
           style={{ backgroundColor: '#454545', color:'white', border:'#001d66' }}

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
      <h4 className="m-0">Manage Shippers</h4>
      <span
        className="p-input-icon-left"
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* <i
          style={{ fontSize: "14px", alignItems: "center" }}
          className="pi pi-search"
        /> */}
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
 

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
        <div className="DataTableContainer">

        <DataTable ref={dt} value={products} className='DataTable'
                          paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                          
                    <Column field="ID" header="ID Card" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="FullName" header="Full Name" sortable  style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable sortablestyle={{ minWidth: "12rem" }}></Column>
                    <Column field="Location" header="Location" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="TelephoneNum" header="Telephone Number" sortable style={{ minWidth: '16rem' }}></Column>

                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
        </div>
      </div>

 
      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Shipper Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="ID" className="font-bold">ID Card</label>
          <InputText id="ID" value={product.ID} onChange={(e) => onInputChange(e, 'ID')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.ID })} />
          {submitted && !product.ID && <small className="p-error">ID Card is required.</small>}
          {IDErrorExist && <small className="p-error">{IDErrorExist}</small>}
          {IDErrorExistUpdate && <small className="p-error">{IDErrorExistUpdate}</small>}


        </div>
        <div className="field">
          <label htmlFor="FullName" className="font-bold">Full Name</label>
          <InputText id="FullName" value={product.FullName} onChange={(e) => onInputChange(e, 'FullName')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.FullName })} />
          {submitted && !product.FullName && <small className="p-error">Full Name is required.</small>}
          
        </div>
        <div className="field">
          <label htmlFor="Email" className="font-bold">Email </label>
          <InputText
            id="email"
            value={product.email}
            onChange={(e) => onInputChange(e, "email")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !product.email })}
          />
          {submitted && !product.email && (
            <small className="p-error">Email is required. <br></br></small>
          )}
                    
          {EmailErrorExist && <small className="p-error">{EmailErrorExist}</small>}

        </div>
        <div className="field">
          <label htmlFor="Password" className="font-bold">Password</label>
          <InputText
            id="password"
            type="password"
            value={product.password}
            onChange={(e) => onInputChange(e, "password")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.password,
            })}
          />
          {submitted && !product.password && (
            <small className="p-error">Password is required.</small>
          )}
          {passwordError && product.password && (
            <small className="p-error">{passwordError}</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="Password" className="font-bold">Confirm Password</label>
          <InputText
            id="confirmpassword"
            type="password"
            value={product.confirmpassword}
            onChange={(e) => onInputChange(e, "confirmpassword")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.confirmpassword,
            })}
          />
          {submitted && !product.confirmpassword && (
            <small className="p-error">Confirm password is required.</small>
          )}
          {confirmpasswordError!=="" && product.confirmpassword && (<small className="p-error">{confirmpasswordError}</small>)}
        </div>
        <div className="field">
          <label htmlFor="Location" className="font-bold">Location</label>
          <InputTextarea id="Location" value={product.Location} onChange={(e) => onInputChange(e, 'Location')} required rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !product.Location })} />
            {submitted && !product.Location && <small className="p-error">Location is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="TelephoneNum" className="font-bold">Telephone Number</label>
          <InputText id="TelephoneNum" value={product.TelephoneNum} onChange={(e) => onInputChange(e, 'TelephoneNum')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.TelephoneNum })} />
          {submitted && !product.TelephoneNum && <small className="p-error">Telephone Number is required.</small>}
          {phoneNumberError&& product.TelephoneNum && <small className="p-error">{phoneNumberError}</small>}
        </div>
      </Dialog>
      <Dialog visible={productDialogUpdate} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Shipper Details" modal className="p-fluid" footer={productDialogUpdateFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="ID" className="font-bold">ID Card</label>
          <InputText id="ID" value={product.ID} onChange={(e) => onInputChange(e, 'ID')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.ID })} />
          {submitted && !product.ID && (
            <small className="p-error">ID Card is required. <br></br></small>
          )}
          {IDError && <small className="p-error">{IDError}</small>}
          {IDErrorExistUpdate && <small className="p-error">{IDErrorExistUpdate}</small>}
        </div>
        <div className="field">
          <label htmlFor="FullName" className="font-bold">Full Name</label>
          <InputText id="FullName" value={product.FullName} onChange={(e) => onInputChange(e, 'FullName')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.FullName })} />
          {submitted && !product.FullName && <small className="p-error">Full Name is required.</small>}
          
        </div>
        <div className="field">
          <label htmlFor="Email" className="font-bold">Email</label>
          <InputText
            id="email"
            value={product.email}
            onChange={(e) => onInputChange(e, "email")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !product.email })}
          />
          {submitted && !product.email && (<small className="p-error">Email is required.</small>)}
          {EmailErrorExist && product.email&& <small className="p-error">{EmailErrorExist}</small>}
        </div>
        
        <div className="field">
          <label htmlFor="Location" className="font-bold">Location</label>
          <InputTextarea id="Location" value={product.Location} onChange={(e) => onInputChange(e, 'Location')} required rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !product.Location })} />
            {submitted && !product.Location && <small className="p-error">Location is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="TelephoneNum" className="font-bold">Telephone Number</label>
          <InputText id="TelephoneNum" value={product.TelephoneNum} onChange={(e) => onInputChange(e, 'TelephoneNum')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.TelephoneNum })} />
          {submitted && !product.TelephoneNum && <small className="p-error">Telephone Number is required.</small>}
          {phoneNumberError && <small className="p-error">{phoneNumberError}</small>}
        </div>
      </Dialog>
      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
      </Dialog>


    </div>
  );
}
export default ShipperDemo ;