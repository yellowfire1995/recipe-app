import { useAuth0 } from "@auth0/auth0-react";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export function HamburgerMenuLinks() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return (
      <>
        <Nav.Link as={Link} to="/recipes" href="recipes">
          All Recipes
        </Nav.Link>
        <Nav.Link as={Link} to="/myrecipes" eventKey="myrecipes">
          My Recipes
        </Nav.Link>
        <Nav.Link as={Link} to="/newrecipe" eventKey="newrecipe">
          Add Recipe
        </Nav.Link>
        <Nav.Link as={Link} to="/planner" eventKey="planner">
          Plans
        </Nav.Link>
        <Nav.Link as={Link} to="/collections" eventKey="collections">
          Collections
        </Nav.Link>
      </>
    );
  } else {
    return (
      <>
        <Nav.Link as={Link} to="/recipes" href="recipes">
          All Recipes
        </Nav.Link>
        <Nav.Link as={Link} to="/collections" eventKey="collections">
          Collections
        </Nav.Link>
        <Nav.Link
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
