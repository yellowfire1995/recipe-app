import { useAuth0 } from "@auth0/auth0-react";
import { NavDropdown } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { CollectionsDropdown } from "./CollectionsDropdown";

export function HeaderLinklist() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return (
      <>
        <Nav.Link as={Link} to="/recipes" eventKey="recipes">
          All Recipes
        </Nav.Link>
        <Nav.Link as={Link} to="/newrecipe" eventKey="newrecipe">
          Add Recipe
        </Nav.Link>
        <CollectionsDropdown />
        <NavDropdown
          title="My Items"
          id="myItems"
          align="end"
          className="me-1 nav-drop"
        >
          <NavDropdown.Item
            as={Link}
            to="/myrecipes"
            eventKey="myrecipes"
            className="nav-drop"
          >
            Recipes
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/planner"
            eventKey="planner"
            className="nav-drop"
          >
            Plans
          </NavDropdown.Item>
          <NavDropdown.Item
            as={Link}
            to="/collections"
            eventKey="collections"
            className="nav-drop"
          >
            Collections
          </NavDropdown.Item>
        </NavDropdown>
      </>
    );
  } else {
    return (
      <>
        <Nav.Link as={Link} to="/recipes" eventKey="recipes">
          All Recipes
        </Nav.Link>
        <CollectionsDropdown />
        <Nav.Link
          eventKey="login"
          onClick={() => {
            loginWithRedirect({
              appState: { returnTo: location.pathname },
              authorizationParams: {
                redirect_uri: `${window.location.origin}/callback`,
              },
            });
          }}
        >
          Log in/Sign Up
        </Nav.Link>
      </>
    );
  }
}
