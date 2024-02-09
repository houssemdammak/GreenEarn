import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
function CitizensDemo() {
  let emptyProduct = {
    email: "",
    password:"" ,
    confirmpassword:"" ,
    FullName: "",
    WalletID: "",
  };
  /////error sets 
  const [EmailErrorExist, setEmailErrorExist] = useState("");
  const [WalletIdError, setWalletIDError] = useState('');
  const [passwordError, setpasswordError] = useState("");
  const [confirmpasswordError, setconfirmpasswordError] = useState("");

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [productDialogUpdate, setProductDialogUpdate] = useState(false);

  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const fetchCitizens = async () => {
    const response = await fetch("/api/citizens");
    const products = await response.json();
    setProducts(products);
    console.log(products);
  };

  const fetchCitizensCalled = useRef(false);

  useEffect(() => {
    if (!fetchCitizensCalled.current) {
      fetchCitizens();
      fetchCitizensCalled.current = true;
    }
  }, [fetchCitizensCalled]);

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setProductDialogUpdate(false);
    setEmailErrorExist("");
    setWalletIDError("") ;setconfirmpasswordError("");setpasswordError("") ;
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
  const validateWalletID = (walletID) => {
    const addressRegex = /^0x[0-9a-fA-F]{40}$/; // Expression régulière pour valider une adresse Ethereum

    if (!walletID) {
        return "Wallet ID required";
    }
    if (!addressRegex.test(walletID)) {
        return "Wallet ID must be a valid Ethereum address.";
    }

    return ""; // Wallet ID valide
};
// fullname
//email 
// password // confirmpassword //wallet id 
  const saveProduct = async () => {
    setSubmitted(true);
    let _products = [...products];
    let _product = { ...product };
    //console.log(_product)

    // verifier email existe ou non 
    const index = findIndexByEmail(_product.email);
    const isExistEmail = index !== -1;
    const isExistEmailError = isExistEmail ? "Email already exist ." : "";
    //walet id verification 
    const errorWallet = "";

    //const errorWallet = validateWalletID(_product.WalletID);
    //verifier le password confirm 
    const confirmationpass =(product.confirmpassword == product.password) 
    //password not strong 
    
    const validatePassword=isPasswordStrong(_product.password) ;

    /////////////////////
    
    //////////////
    if ( errorWallet =="" && validatePassword && confirmationpass &&isExistEmailError ==""  &&
    product.email.trim() !== "" &&product.FullName.trim()!== "" &&product.password.trim() !=="" && product.confirmpassword.trim() !==""&& product.WalletID.trim() !== ""
    ) {
      try {
        delete _product.confirmpassword;
        console.log(_product)

        const response = await fetch("/api/citizens/register", {
          method: "POST",
          body: JSON.stringify(_product),
          headers: {
            "Content-Type": "application/json",
          },
        });
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Citizen Created",
          life: 3000,
        });
        fetchCitizens();
        setEmailErrorExist("");
        setWalletIDError("") ;setconfirmpasswordError("");setpasswordError("") ;
        setProducts(_products);setProduct(emptyProduct);setProductDialog(false);
        //console.log(_product)
        // const responseData = await response.json();
        // fetchCitizens();
        // console.log('Réponse de l\'API:', responseData);
      } catch (error) {
        console.error("Erreur lors de l'envoi des données à l'API:", error);
      }

    
    } else {
      
      // Mise à jour de l'état d'erreur pour chaque champ
      if(!validatePassword){
        setpasswordError("Please enter a strong password")
      }
      if(!confirmationpass){
        setconfirmpasswordError("Please confirm your password")
      }
       if(isExistEmailError !=""){
         setEmailErrorExist(isExistEmailError);
       }
      if(errorWallet !==""){
         setWalletIDError(errorWallet) ;
       }
    }
  };
  const saveUpdatedProduct = async () => {
    setSubmitted(true);
    let _products = [...products];
    let _product = { ...product };
    //console.log(product)

    //email exist 
    const index = findIndexByEmail(_product.email);
    const indexDB = findIndexBy_id(_product._id);
    const isTheSameEmail = _product.email ==_products[indexDB].email;
    const isExistEmailError = index !== -1 && !isTheSameEmail;
   //walet id verification 
   const errorWallet = "";
   //const errorWallet = validateWalletID(_product.WalletID);
 
   if ( errorWallet ==""  && !isExistEmailError  &&
   product.email.trim() !== "" &&product.FullName.trim()!== "" && product.WalletID.trim() !== ""
   ) {
      setProductDialog(false);
      delete product.confirmpassword 
      delete product.password 
      try {
        console.log(_product)
        const response = await fetch(`/api/citizens/${_product._id}`, {
          method: "PATCH",
          body: JSON.stringify(_product),
          headers: {
            "Content-Type": "application/json",
          },
        });
        //fetchCitizens();
        
        if (response.ok) {
          _products[indexDB] = _product;
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Citizen Updated",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du citizen:", error);
      }
      setProductDialogUpdate(false);
      
        setProducts(_products);
        setEmailErrorExist("");
        setWalletIDError("") ;setconfirmpasswordError("");setpasswordError("") ;
    } else {
      if(isExistEmailError !=""){
        setEmailErrorExist("Email already exist .");
      }
     if(errorWallet !==""){
        setWalletIDError(errorWallet) ;
      }
      

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
      const response = await fetch(`/api/citizens/${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        let _products = products.filter((val) => val._id !== product._id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Citizen Deleted",
          life: 3000,
        });
      } else {
        console.error(
          "Failed to delete citizen. Server returned:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting citizen:", error.message);
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
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;
    setSubmitted(false);
    setProduct(_product);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          style={{
            backgroundColor: "#454545",
            color: "white",
            border: "#001d66",
          }}
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
      <h4 className="m-0">Manage Citizens</h4>
      <h5>houssem :Password123! asma:ABCabc123! yasmine:yasmine123!</h5>
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
          <DataTable
            ref={dt}
            value={products}
            className="DataTable"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            header={header}
          >
            

            <Column
              field="FullName"
              header="Full Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="WalletID"
              header="Wallet Number"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>

            {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Citizen Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="FullName" className="font-bold">Full Name</label>
          <InputText
            id="FullName"
            value={product.FullName}
            onChange={(e) => onInputChange(e, "FullName")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.FullName,
            })}
          />
          {submitted && !product.FullName && (
            <small className="p-error">Full Name is required.</small>
          )}
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
          {confirmpasswordError && product.confirmpassword && (<small className="p-error">{confirmpasswordError}</small>)}
        </div>
        <div className="field">
          <label htmlFor="BankCardNumber" className="font-bold">
            Wallet ID
          </label>
          <InputText
            id="WalletID"
            value={product.WalletID}
            onChange={(e) => onInputChange(e, "WalletID")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.WalletID,
            })}
          />
          {submitted && !product.WalletID && (<small className="p-error">Wallet ID is required.</small>)}
          {WalletIdError && product.WalletID && (
            <small className="p-error">{WalletIdError}</small>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={productDialogUpdate}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Citizen Details"
        modal
        className="p-fluid"
        footer={productDialogUpdateFooter}
        onHide={hideDialog}
      >
       
        <div className="field">
          <label htmlFor="FullName" className="font-bold">Full Name</label>
          <InputText
            id="FullName"
            value={product.FullName}
            onChange={(e) => onInputChange(e, "FullName")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.FullName,
            })}
          />
          {submitted && !product.FullName && (
            <small className="p-error">Full Name is required.</small>
          )}
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
          <label htmlFor="WalletID" className="font-bold"> Wallet ID </label>
          <InputText
            id="WalletID"
            value={product.WalletID}
            onChange={(e) => onInputChange(e, "WalletID")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.WalletID,
            })}
          />
          {submitted && !product.WalletID && (
            <small className="p-error">Wallet ID  is required .</small>
          )}
          {WalletIdError && product.WalletID && (
            <small className="p-error">{WalletIdError}</small>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
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
export default CitizensDemo;
