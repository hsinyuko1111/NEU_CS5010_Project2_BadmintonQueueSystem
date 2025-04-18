import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function BaseTemplate({ children }) {
  return (
    <div>
      <NavBar />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
}

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Badminton Queue System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/timer-mode">TimerMode</Nav.Link>
            <Nav.Link href="/match-mode">MatchMode</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link href="/login">CheckIn</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            <NavDropdown title="Admin" id="basic-nav-dropdown">
              <NavDropdown.Item href="/admin/delete">
                Delete User
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/checkout">
                Checkout User
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/reset">
                Reset Game
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function Footer() {
  return (
    <Container>
      <footer>Made by 🥬🐥🐣 Cindy 🏸</footer>
    </Container>
  );
}
