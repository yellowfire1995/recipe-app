import { useAuth0 } from "@auth0/auth0-react";
import { NavDropdown } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { CollectionsDropdown } from "./CollectionsDropdown";

export function HeaderLinklist() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return (
      <>
        <Nav.Link href="/recipes">All Recipes</Nav.Link>
        <Nav.Link href="/newrecipe">Add Recipe </Nav.Link>
        <CollectionsDropdown />
        <NavDropdown
          title="My Items"
          id="myItems"
          align="end"
          className="me-1 nav-drop"
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
        <CollectionsDropdown />
        <Nav.Link
          onClick={() =>
            loginWithRedirect({
              appState: { returnTo: location.pathname },
            })
          }
        >
          Log in/Sign Up
        </Nav.Link>
      </>
    );
  }
}
