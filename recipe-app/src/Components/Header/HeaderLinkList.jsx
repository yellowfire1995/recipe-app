import { useAuth0 } from "@auth0/auth0-react";
import Nav from "react-bootstrap/Nav";

export function HeaderLinklist() {
  const { isAuthenticated, loginWithPopup } = useAuth0();

  if (isAuthenticated) {
    return (
      <>
        <Nav.Link href="/recipes">All Recipes</Nav.Link>
        <Nav.Link href="/myrecipes">Your Recipes</Nav.Link>
        <Nav.Link href="/newrecipe">Add Recipe </Nav.Link>
        <Nav.Link href="/planner">Planner </Nav.Link>
        <Nav.Link href="/collections">Collections</Nav.Link>
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
