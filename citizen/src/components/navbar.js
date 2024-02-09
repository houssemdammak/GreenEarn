import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import AuthContext from '../contexts/authContext';
import { useContext } from 'react';
const NavigationBar=()=> {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };
=======


const NavigationBar=()=> {
  const navigate = useNavigate()
>>>>>>> 0793ab32d304aa687a70538a1e761e1272d75edb
  return (
    <Navbar expand="lg"style={{backgroundColor:"transparent"}}>
      <Container>
        <Navbar.Brand as={Link} to="/home">GreenEarn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/bin">Bin Status</Nav.Link>
<<<<<<< HEAD
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;

            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
=======
            <Nav.Link onClick={() => navigate("/logout")}>Logout</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
>>>>>>> 0793ab32d304aa687a70538a1e761e1272d75edb
