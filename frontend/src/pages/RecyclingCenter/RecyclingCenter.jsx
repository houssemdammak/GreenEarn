import React, { useState,useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import logo from "../../images/EarnGreen Icons/icon_black.png";
import AuthContext from "../../contexts/authSlice";
import "./RecyclingCenter.css";
import { useWeb3 } from "../../contexts/web3Context";
import { recycleCollection} from "../../web3";

function RecyclingCenter() {
  const { contract } = useWeb3();
 const {id, name, logout } = useContext(AuthContext);
  const [confirm, setDialogConfirm] = useState(false);
  const [collections, setCollections] = useState(null);
  const [collection, setCollection] = useState(null);
  const [numTasksAdded, setNumTasksAdded] = useState(0); // État pour stocker le nombre de tâches ajoutées
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const countTasksAdded = (collections) => {
    if (collections !== null) {
      return collections.filter((c) => c.recyclingdatedate==null)
        .length;
    }
    return 0;
  };

  

  const fetchCollection = async () => {
    const response = await fetch(`/api/collection/`);
    const collection = await response.json();
    setCollections(collection);
    console.log(collection);
    
  };


  const fetchCollectionCalled = useRef(false);

  useEffect(() => {
    if (!fetchCollectionCalled.current) {
      fetchCollection();
      fetchCollectionCalled.current = true;
    }
  }, [fetchCollectionCalled]);
  useEffect(() => {
    if (collections !== null) {
      const numAdded = countTasksAdded(collections);
      setNumTasksAdded(numAdded);
      console.log(numAdded); // Utilisez numAdded plutôt que numTasksAdded pour obtenir la valeur mise à jour
    }
  }, [collections]);
  
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
    // Convertir la date de type string en objet Date
    const date = new Date(dateString);

    // Formater la date en JJ/MM/AAAA
    const formattedDate = date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Formater l'heure en HH:MM
    const formattedTime = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Combinaison de la date et de l'heure formatées
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
        </div>
        <div className="navbar-items">
          <div className="navbar-user">
            <span className="user-name">{name}</span>
            <Avatar icon="pi pi-user" shape="circle" className="mr-2" style={{  backgroundColor: 'transparent' ,color: "black", fontSize: "1.5rem" }} />

          <i className="pi pi-bell p-overlay-badge mr-2" style={{ color: "black", fontSize: "1.1rem" }}>
           
            <Badge severity="success" value={numTasksAdded} style={{ fontSize: '0.65rem'}}></Badge>
          </i>

          {/* Avatar pour se déconnecter */}
          <Avatar icon="pi pi-sign-out" shape="circle" onClick={handleLogout} style={{backgroundColor: 'transparent' , color: "black", fontSize: "1.5rem" }} />

            
          </div>
        </div>
      </nav>
    );
  };
  const updateCollectionByshipper = async () => {
    // const response = await fetch(`/api/collection/updateCollectionByshipper/${collection.binID._id}`);
    const currentDate=new Date();
    try {
      const blockchainTransactionResult = await recycleCollection(contract,collection.BlockchainID,currentDate);
      console.log(collection.BlockchainID,id)
      if (blockchainTransactionResult.status === 'accepted') {

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
        }else {
          console.error('Error recycling collection', response.statusText);
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed recyclig collection', life: 3000 });
        }
      } else {
        console.error('Blockchain transaction failed.');
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Blockchain transaction failed. recycle collection  reverted.', life: 3000 });
      }
    } 
    catch (error) {
      console.error('Error recycling collection:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to recycle collection.', life: 3000 });
    }
  };
  return (
    <div className="BodyShipper">
      <Navbar />
      <Toast ref={toast} />
      <div className="cardShipper">
        <div className="DataTableContainer">
        <DataTable
            ref={dt}
            value={productsWithIndex}
            className="DataTableShipper"
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
            {/* <Column field="binID.currentWeight" header="Current Weight (Kg)" sortable style={{ minWidth: '16rem' }}></Column> */}
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
          <span> Are you sure you want to ship ? </span>
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
              onClick={updateCollectionByshipper}
            />
          </div>
        </React.Fragment>
      </Dialog>
    </div>
  );
}

export default RecyclingCenter;
