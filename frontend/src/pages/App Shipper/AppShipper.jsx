import React, { useState,useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useClickOutside } from 'primereact/hooks';
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { useWeb3 } from "../../contexts/web3Context";
import { shipCollection} from "../../web3";
import iconShipper from "../../images/shipper1.gif";
import logo from "../../images/EarnGreen Icons/icon_black.png";
import AuthContext from "../../contexts/authSlice";
import "./AppShipper.css";

function ShipperApp() {
  const { contract } = useWeb3();
  const {id, name, logout ,token} = useContext(AuthContext);
  const [confirm, setDialogConfirm] = useState(false);
  const [collections, setCollections] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const fetchCollectionCalled = useRef(false);
  const [collection, setCollection] = useState(null);
  const [numTasksAdded, setNumTasksAdded] = useState(0); // État pour stocker le nombre de tâches ajoutées
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!fetchCollectionCalled.current) {
      fetchCollection();
      fetchCollectionCalled.current = true;
    }
  }, [fetchCollectionCalled]);
  useEffect(() => {
    if (collections !== null) {
      const numAdded = getNotification(collections);
      setNumTasksAdded(numAdded.length|| "0");
      setNotifications(numAdded)
      console.log(numAdded); // Utilisez numAdded plutôt que numTasksAdded pour obtenir la valeur mise à jour
    }
  }, [collections]);
  let productsWithIndex = [];
  if (collections !== null) {
    productsWithIndex = collections.map((product, index) => ({
      ...product,
      index: collections.length - index,
    }));
  }
    useClickOutside(overlayRef, async () => {
      const response = await fetch(`/api/collection/markAsRead`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });
      console.log(response);
      setVisible(false);
      setNumTasksAdded("0");
      //setNotifications(null)
    });
/////////////////////////////
  const getNotification = (collections) => {
    if (collections && collections.length > 0) {
        const newNotifications = collections.filter((c) => c.isNew === true);
        // Retourner le tableau filtré des nouvelles notifications
        return newNotifications;
    } else {
        // S'il n'y a pas de collections ou si collections est null, retourner un tableau vide
        return [];
    }
};
  const fetchCollection = async () => {
    const response = await fetch(`/api/shippers/getCollection/${id}`);
    const collection = await response.json();
    setCollections(collection);
    console.log(collection);
    console.log(notifications)
    
  };
  const updateCollectionByshipper = async () => {
    const currentDate=new Date().toString();
    try {
      const blockchainTransactionResult = await shipCollection(contract,collection.BlockchainID,collection.shipperID.ID,currentDate);
      console.log(collection.BlockchainID,id,collection.shipperID.ID)
      if (blockchainTransactionResult.status === 'accepted') {

    // const response = await fetch(`/api/collection/updateCollectionByshipper/${collection.binID._id}`);
    const response = await fetch(`/api/collection/updateCollectionByshipper`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ binID:collection.binID._id, collectionID:collection._id })
    });

    if (response.status === 200) {
      const newCollection = await response.json();
      console.log(newCollection)
      console.log(formatDate(newCollection.collection.shippingdate));
      fetchCollection()
      setDialogConfirm(false);
       toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Collection shipped', life: 3000 });
     } else {
       console.error('Error shipping collection', response.statusText);
       toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed shipping collection', life: 3000 });
     }
   } else {
     console.error('Blockchain transaction failed.');

     toast.current.show({ severity: 'error', summary: 'Error', detail: 'Blockchain transaction failed. ship collection reverted.', life: 3000 });
   }
 } catch (error) {
   console.error('Error shipping collection:', error);
   toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to ship collection.', life: 3000 });
 }
  };

  const handleLogout = () => {
    logout();
  };
  const actionBodyTemplate = (rowData) => {
    if (rowData.shippingdate) {
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
          <p style={{fontFamily:"Slackey",fontSize:"20px",fontWeight:"normal"}}>Shippers</p>
          <div className="navbar-items">
        <img
            src={iconShipper}
            style={{ width: "80px", height: "50px" }}
            alt="Logo"
            className="logo"
          />
          </div>
        </div>
        <div className="navbar-items">
          <div className="navbar-user">
            <span className="user-name">{name}</span>
            <Avatar icon="pi pi-user" shape="circle" className="mr-2" style={{  backgroundColor: 'transparent' ,color: "black", fontSize: "1.5rem" }} />
         <div className="relative" >
    <i
        className="pi pi-bell p-overlay-badge mr-2"
        onClick={() => setVisible(true)}
        style={{ color: "black", fontSize: "1.1rem", zIndex: 10 }}
    >
        {numTasksAdded !== "0" && (
            <Badge severity="success" value={numTasksAdded} style={{ fontSize: '0.65rem'}}></Badge>
        )}
        {visible ? (
            <div ref={overlayRef} className="absolute z-50 top-5 right-0 border rounded shadow-lg p-2 whitespace-nowrap" style={{ width:"310px", borderRadius:"15px", backgroundColor:"white"}}>
                <div className="notification-container" style={{ overflowX: "auto" ,maxHeight: "250px"}}>
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            className="notification-item flex items-center p-2 bg-white border rounded-lg shadow-sm mb-3"
                            style={{ borderStyle: "white", borderColor: "black", borderRadius: "11px" }}
                        >
                            <div className="flex justify-center items-center mr-2 rounded-full">
                                <i className="pi pi-trash " style={{ fontSize: '3rem', color:"gray"}}></i>
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-lg font-semibold mb-1">New Task</h4>
                                <p className="text-sm text-gray-700">
                                    Location: {notification.binID.location}
                                </p>
                                <p className="text-sm text-gray-700">Date: {formatDate(notification.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : null}
    </i>
</div>
          {/* Avatar pour se déconnecter */}
          <Avatar icon="pi pi-sign-out" shape="circle" onClick={handleLogout} style={{backgroundColor: 'transparent' , color: "black", fontSize: "1.5rem" }} />
          </div>
        </div>
      </nav>
    );
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
              field="binID._id"
              header="Bin ID"
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
              field="binID.location"
              header="Location"
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
              header="Capacity (Kg)"
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

export default ShipperApp;
