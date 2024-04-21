import React, { useState,useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import logo from "../../images/EarnGreen Icons/icon_black.png";
import AuthContext from "../../contexts/authSlice";
import "./RecyclingCenter.css";
import { useWeb3 } from "../../contexts/web3Context";
import { RecycleCollection} from "../../web3";
import iconShipper from "../../images/icon_recycle.gif";

function RecyclingCenter() {
  const { contract } = useWeb3();
  const {id, name, logout } = useContext(AuthContext);
  const [confirm, setDialogConfirm] = useState(false);
  const [collections, setCollections] = useState(null);
  const [collection, setCollection] = useState(null);
  //const fetchCollectionCalled = useRef(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const fetchCollection = async () => {
    const response = await fetch(`/api/collection/`);
    const collection = await response.json();
    setCollections(collection);
    console.log(collection);
  };
  const updateCollectionByRecycler = async () => {
    const currentDate=new Date().toString();
    try {
      const blockchainTransactionResult = await RecycleCollection(contract,collection.BlockchainID,currentDate);
      console.log(collection.BlockchainID,id)
      if (blockchainTransactionResult.status === 'accepted') {

    // const response = await fetch(`/api/collection/updateCollectionByshipper/${collection.binID._id}`);
    const response = await fetch(`/api/collection/updateCollectionByCenter`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({collectionID:collection._id,binID:collection.binID._id,collectionshippingdate:collection.shippingdate  })
    });

    if (response.status === 200) {
      const newCollection = await response.json();
      console.log(newCollection)
      //console.log(formatDate(newCollection.collection.date));
      fetchCollection()
      setDialogConfirm(false);
       toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Collection Recycled', life: 3000 });
     } else {
       console.error('Error shipping collection', response.statusText);
       toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed recycling collection', life: 3000 });
     }
   } else {
     console.error('Blockchain transaction failed.');
     toast.current.show({ severity: 'error', summary: 'Error', detail: 'Blockchain transaction failed. collection recycle reverted.', life: 3000 });
   }
 } catch (error) {
   console.error('Error recycling collection:', error);
   toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to recycle collection.', life: 3000 });
 }
};
const [fetchCollectionCalled, setFetchCollectionCalled] = useState(false);

useEffect(() => {
  if (!fetchCollectionCalled) {
    fetchCollection();
    setFetchCollectionCalled(true);
  }
}, [fetchCollectionCalled]);
  // useEffect(() => {
  //   if (!fetchCollectionCalled.current) {
  //     fetchCollection();
  //     fetchCollectionCalled.current = true;
  //   }
  // }, [fetchCollectionCalled]);
  let productsWithIndex = [];
  if (collections !== null) {
    productsWithIndex = collections.map((product, index) => ({
      ...product,
      index: collections.length - index,
    }));
  }

  const handleLogout = () => {
    logout();
  };
  const actionBodyTemplate = (rowData) => {
    if (rowData.status==="Recycled") {
      return (
        <React.Fragment>
          <Button
            icon="pi pi-check"
            rounded
            outlined
            severity="success"
            className="mr-2"
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Button
            icon="pi pi-pencil"
            rounded
            outlined
            severity="danger"
            className="mr-2"
            onClick={() => confirmUpdate(rowData)}
          />
        </React.Fragment>
      );
    }
  };
  const confirmUpdate = (rowData) => {
    setCollection(rowData);
    setDialogConfirm(true);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };
  const hideConfirmDialog = () => {
    setDialogConfirm(false);
  };
  const Navbar = () => {
    return (
      <nav className="navbar">
       <div className="navbar-logo">
          <img
            src={logo}
            style={{ width: "200px", height: "45px" }}
            alt="Logo"
            className="logo"
          />
          <p style={{fontFamily:"Slackey",fontSize:"20px",fontWeight:"normal"}}>Recycling Center</p>
          <div className="navbar-items">
        <img
            src={iconShipper}
            style={{ width: "90px", height: "90px" }}
            alt="Logo"
            className="logo"
          />
          </div>
        </div>
        <div className="navbar-items">
          <div className="navbar-user">
            <span className="user-name">{name}</span>
            <Avatar icon="pi pi-user" shape="circle" className="mr-2" style={{  backgroundColor: 'transparent' ,color: "black", fontSize: "1.5rem" }} />
          <Avatar icon="pi pi-sign-out" shape="circle" onClick={handleLogout} style={{backgroundColor: 'transparent' , color: "black", fontSize: "1.5rem" }} />
          </div>
        </div>
      </nav>
    );
  };
  return (
    <div className="BodyRecycler">
      <Navbar />
      <Toast ref={toast} />
      <div className="cardRecycler">
        <div className="DataTableContainer">
        <DataTable
            ref={dt}
            value={productsWithIndex}
            className="DataTableRecycler"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
          >
            <Column
              field="_id"
              header="Collection ID"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="binID.type"
              header="Type"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="shipperID.FullName"
              header="Shipper Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              field="createdAt"
              header="Date"
              sortable
              style={{ minWidth: "16rem" }}
              body={(rowData) => formatDate(rowData.createdAt)}
            />
            <Column
              field="binID.capacity"
              header="Weight"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={confirm}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        onHide={hideConfirmDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span> Are you sure you want to recycle ? </span>
        </div>
        <React.Fragment>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button
              label="No"
              icon="pi pi-times"
              outlined
              onClick={hideConfirmDialog}
              style={{ marginRight: "1rem" }} // Espacement entre les boutons
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              severity="danger"
              onClick={updateCollectionByRecycler}
            />
          </div>
        </React.Fragment>
      </Dialog>
    </div>
  );
}

export default RecyclingCenter;
