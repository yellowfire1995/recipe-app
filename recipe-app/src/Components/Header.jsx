import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://dev-8oxkv6xzy7mdml3z.us.auth0.com/api/v2/`, // Value in Identifier field for the API being called.
            scope: "read:current_user update:current_user_metadata", // Scope that exists for the API being called. You can create these through the Auth0 Management API or through the Auth0 Dashboard in the Permissions view of your API.
          },
        });
        const response = isLoading
          ? null
          : await axios.get(
              `https://dev-8oxkv6xzy7mdml3z.us.auth0.com/api/v2/users/${user.sub}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
        setUserData(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      className="justify-content-left d-flex-wrap"
    >
      <Container>
        <Navbar.Brand>myRecipe</Navbar.Brand>
        <Link to="/">All Recipes</Link>
        <Link to="/myrecipes">Your Recipes</Link>
        <Link to="/ingredients">Ingredients</Link>
        <Link to="/newrecipe">New Recipe</Link>
        <Link to="/importrecipe">Import Recipe </Link>

        <Navbar.Text>
          Signed in as: <Link to="/profile">{userData?.nickname} </Link>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;
