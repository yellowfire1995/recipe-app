import { useAuth0 } from "@auth0/auth0-react";
import { NavDropdown } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

export function HeaderLinklist() {
  const { isAuthenticated, loginWithPopup } = useAuth0();

  if (isAuthenticated) {
    return (
      <>
        <Nav.Link href="/recipes">All Recipes</Nav.Link>
        <Nav.Link href="/newrecipe">Add Recipe </Nav.Link>
        <NavDropdown
          title="Collections"
          id="collections"
          align="end"
          className="nav-drop me-1"
        >
          <NavDropdown.Item href="/collections" className="nav-drop">
            Family Recipes
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown
          title="My Items"
          id="myItems"
          align="end"
          className="nav-drop me-1"
        >
          <NavDropdown.Item href="/myrecipes" className="nav-drop">
            Recipes
          </NavDropdown.Item>
          <NavDropdown.Item href="/planner" className="nav-drop">
            Plans
          </NavDropdown.Item>
          <NavDropdown.Item href="/collections" className="nav-drop">
            Collections
          </NavDropdown.Item>
        </NavDropdown>
      </>
    );
  } else {
    return (
      <>
        <Nav.Link href="/recipes">All Recipes</Nav.Link>
        <Nav.Link onClick={loginWithPopup}>Log in/Sign Up</Nav.Link>
      </>
    );
  }
}
