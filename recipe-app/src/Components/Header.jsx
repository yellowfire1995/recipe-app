import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import SearchIcon from "@mui/icons-material/Search";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth0Audience } from "../../env/env";
import Col from "react-bootstrap/esm/Col";

function Header() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: auth0Audience, // Value in Identifier field for the API being called.
            scope: "read:current_user update:current_user_metadata", // Scope that exists for the API being called. You can create these through the Auth0 Management API or through the Auth0 Dashboard in the Permissions view of your API.
          },
        });
        const response = isLoading
          ? null
          : await axios.get(`${auth0Audience}users/${user.sub}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
        setUserData(response.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" sticky="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="header" />
        <Navbar.Offcanvas id="header" placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasMenu`}>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="justify-content-center">
            <Navbar.Brand>myRecipe</Navbar.Brand>
            <Nav className="">
              <Nav.Link href="/recipes">All Recipes</Nav.Link>
              <Nav.Link href="/myrecipes">Your Recipes</Nav.Link>
              <Nav.Link href="/importrecipe">Add Recipe </Nav.Link>
            </Nav>
            <Col md={2} lg={4}>
              <Form className="d-flex flex-shrink-1">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="mainSearchBox "
                  aria-label="Search"
                  bg="light"
                />
                <SearchIcon fontSize="large" className="align-self-end" />
              </Form>
            </Col>

            <Navbar.Text>
              Signed in as: <Link to="/profile">{userData?.nickname} </Link>
            </Navbar.Text>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Header;
