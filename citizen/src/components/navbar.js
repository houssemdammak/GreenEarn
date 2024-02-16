import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
 import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming Font Awesome icons
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Example icons
import AuthContext from '../contexts/authContext';
import { useContext } from 'react';

const NavigationBar=()=> {
  const { name ,logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };
  return (
    <Navbar expand="lg"style={{backgroundColor:"transparent"}}>
      <Container>
        <Navbar.Brand as={Link} to="/Home">GreenEarn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          
            <Nav.Link as={Link} to="/Home">Home</Nav.Link>
            <Nav.Link as={Link} to="/Bin">Bin Status</Nav.Link>
            {/* <Nav.Link onClick={handleLogout}>Logout</Nav.Link> */}
          </Nav>
          {/* <Nav>
          <Nav.Link>
              <FontAwesomeIcon icon={faBell} />
            </Nav.Link>
            <Nav.Link>
              <FontAwesomeIcon icon={faUserCircle} />
            </Nav.Link>

            </Nav> */}
             <Nav>
            <NavDropdown title={<FontAwesomeIcon icon={faUserCircle} />} align="end">
              <NavDropdown.Item>{name}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
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
