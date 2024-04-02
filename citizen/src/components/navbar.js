import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming Font Awesome icons
import {faUserCircle ,faBell } from '@fortawesome/free-solid-svg-icons'; // Example icons
import AuthContext from '../contexts/authContext';
import { useContext ,useEffect, useState } from 'react';

import {faCoins,faCalendarAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const NavigationBar=()=> {
  const { name ,logout ,id} = useContext(AuthContext);
  const [products, setProducts] = useState(null);
  const unreadCount = products?.filter(product => product.isNew).length || 0; // Compter les produits avec isNew=true
  useEffect(() => {
    const getRewarded = async () => {
      try {
        const response = await fetch(`/api/wastes/getRewarded/${id}`);
        const products = await response.json();
        setProducts(products);
        console.log(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    getRewarded();
  }, []);
  const handleNotificationClick = async () => {
    const unreadProductIds = products?.filter(product => product.isNew).map(product => product._id);
    console.log(unreadProductIds);
    
    if (unreadProductIds && unreadProductIds.length > 0) {
      try {
        const response = await fetch(`/api/wastes/markAsRead`, {
          method: 'POST', // Utilisation de la méthode POST
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: unreadProductIds })
        });
  
        if (response.ok) {
          const updatedProducts = products.map(product => {
            if (unreadProductIds.includes(product._id)) {
              return { ...product, isNew: false };
            }
            return product;
          });
          setProducts(updatedProducts);
        } else {
          console.error('Failed to mark notifications as read:', response.statusText);
        }
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    } else {
      console.log('No unread products to mark as read.');
    }
  };
  
  
  
  const handleLogout = () => {
    logout();
  };
  return (
    <Navbar expand="lg" style={{ backgroundColor: "transparent" }}>
      <Container>
        <Navbar.Brand as={Link} to="/Home">GreenEarn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Home">Home</Nav.Link>
            <Nav.Link as={Link} to="/Bin">Bin Status</Nav.Link>
          </Nav>
          <Nav>
            <div className="d-flex align-items-center">
              

            <NavDropdown
      title={
        <>
          <FontAwesomeIcon icon={faBell} className="notification-bell-icon" /> {/* Add styling class */}
          {unreadCount > 0 && (
            <span className="position-absolute translate-middle badge rounded-pill bg-success badge-sm">
              {unreadCount}
            </span>
          )}
        </>
      }
      align="end"
      className="notification-dropdown" onClick={handleNotificationClick}
    >
      {products?.map((waste, index) => (
        <>
          <NavDropdown.Item key={index}>
            <div className="notification-item d-flex flex-column px-3 py-2 border-bottom border-gray-300"> 
              <div className="notification-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 detail-icon text-danger" /> 
                  <span className="detail-label">Added Date : </span>
                    <span>{ new Date(waste.dateAdded).toLocaleDateString()}</span>
                    </div>
                    </div>
                    <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 detail-icon text-success" /> 
                    <span className="detail-label">Recycled Date : </span>
                    <span>{ new Date(waste.recyclingdate).toLocaleDateString()}</span>
                  </div>
              <div className="notification-details d-flex justify-content-between align-items-center pt-2"> 
                <div className="detail-section d-flex flex-column align-items-start"> 
                  <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faCoins} className="mr-1 reward-icon text-warning" /> 
                    <span>{waste.weight * 100} GRN</span>
                  </div>
                </div>
               </div>
            </div>
          </NavDropdown.Item>
          {index < products.length - 1 && <NavDropdown.Divider />} {/* Add divider except for the last item */}
        </>
      ))}
    </NavDropdown>




              <NavDropdown title={<FontAwesomeIcon icon={faUserCircle} />} align="end">
                <NavDropdown.Item>{name}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ); 
  
}

export default NavigationBar;



// import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown'; // Importer NavDropdown
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link } from "react-router-dom";
// import AuthContext from '../contexts/authContext';
// import { useContext } from 'react';

// const NavigationBar = () => {
//   const { user, logout } = useContext(AuthContext);

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <Navbar expand="lg" style={{ backgroundColor: "transparent" }}>
//       <Container>
//         <Navbar.Brand as={Link} to="/Home">GreenEarn</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/Home">Home</Nav.Link>
//             <Nav.Link as={Link} to="/Bin">Bin Status</Nav.Link>
//           </Nav>
//           <Nav>
//             <NavDropdown title={<><i className="bi bi-person-fill"></i> {user.name}</>}>
//               <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
//             </NavDropdown>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default NavigationBar;
