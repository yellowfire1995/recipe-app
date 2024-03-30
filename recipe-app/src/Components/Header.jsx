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
import Button from "react-bootstrap/esm/Button";
import NavbarText from "react-bootstrap/esm/NavbarText";
import Row from "react-bootstrap/esm/Row";
import NavDropdown from "react-bootstrap/NavDropdown";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function Header(props) {
  // const { user, isAuthenticated, isLoading } = useAuth0();
  // const { getAccessTokenSilently } = useAuth0();
  // const [userData, setUserData] = useState();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const token = await getAccessTokenSilently({
  //         authorizationParams: {
  //           audience: auth0Audience, // Value in Identifier field for the API being called.
  //           scope: "read:current_user update:current_user_metadata", // Scope that exists for the API being called. You can create these through the Auth0 Management API or through the Auth0 Dashboard in the Permissions view of your API.
  //         },
  //       });
  //       const response = isLoading
  //         ? null
  //         : await axios.get(`${auth0Audience}users/${user.sub}`, {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           });
  //       setUserData(response.data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();
  // }, [getAccessTokenSilently]);

  return (
    <Navbar expand="xl" sticky="top" className="shadow bg-nav">
      <Container fluid className="px-0 justify-content-center">
        <Navbar.Offcanvas id="header" placement="start" className="d-xl-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasMenu`}>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav>
              <Nav.Link href="/recipes">All Recipes</Nav.Link>
              <Nav.Link href="/myrecipes">Your Recipes</Nav.Link>
              <Nav.Link href="/importrecipe">Add Recipe </Nav.Link>
              <Nav.Link href="/profile"> Profile</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <Row className="w-100 p-0">
          <Nav className="flex-row w-100 p-0">
            <Col className="d-flex align-items-center flex-grow-1">
              <Navbar.Toggle aria-controls="header" className="mx-1" />
              <Navbar.Brand href="/recipes" className="d-none d-md-block ps-1">
                <h3>myRecipe</h3>
              </Navbar.Brand>
              <Navbar.Brand className="d-md-none ps-1">myR</Navbar.Brand>
            </Col>
            <Col className="d-flex">
              <Form className="d-inline-flex ms-auto ms-md-0 flex-grow-1">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="mainSearchBox"
                  aria-label="Search"
                />
                <SearchIcon
                  className="align-self-md-center my-auto text-secondary"
                  fontSize="large"
                />
              </Form>
            </Col>
            <Col className=" d-none d-xl-inline-flex flex-grow-1 align-items-center justify-content-end nav-text">
              <Nav.Link href="/recipes">All Recipes</Nav.Link>
              <Nav.Link href="/myrecipes">Your Recipes</Nav.Link>
              <Nav.Link href="/importrecipe">Add Recipe </Nav.Link>
              <NavDropdown
                title="Settings"
                id="settings"
                drop="down-center"
                align={{ xs: "start" }}
                className="nav-drop"
              >
                <NavDropdown.Item href="/profile" className="nav-drop">
                  Profile{" "}
                </NavDropdown.Item>

                <NavDropdown.Item
                  fluid
                  className="d-flex align-items-center justify-content-between nav-drop"
                >
                  {" "}
                  <DarkModeIcon />
                  Dark Mode
                  <Form.Check
                    className="ms-1"
                    type="switch"
                    id="theme-switcher"
                    checked={props.currentTheme === "dark" ? true : false}
                    onClick={props.switchTheme}
                  />
                </NavDropdown.Item>

                <hr />

                <NavDropdown.Item className="nav-drop mt-0 pt-0">
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            </Col>
          </Nav>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;
