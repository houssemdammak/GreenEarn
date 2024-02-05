import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";


const NavigationBar=()=> {
  const navigate = useNavigate()
  return (
    <Navbar expand="lg"style={{backgroundColor:"transparent"}}>
      <Container>
        <Navbar.Brand as={Link} to="/home">GreenEarn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/bin">Bin Status</Nav.Link>
            <Nav.Link onClick={() => navigate("/logout")}>Logout</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;