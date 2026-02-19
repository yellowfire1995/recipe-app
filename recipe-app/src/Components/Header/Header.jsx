import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Col from "react-bootstrap/esm/Col";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import Row from "react-bootstrap/esm/Row";
import NavDropdown from "react-bootstrap/NavDropdown";
import useLocalStorage from "use-local-storage";
import { HeaderLinklist } from "./HeaderLinkList";
import { PopoutMenuLogout } from "./PopoutMenuLogout";

function Header() {
  const { logout, isAuthenticated, loginWithPopup } = useAuth0();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const pageSize = searchParams.get("pageSize");

  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light",
  );

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const navigate = useNavigate();

  return (
    <Navbar expand="xl" sticky="top" className="bg-nav p-0 w-100">
      <Container fluid className="px-0 justify-content-center">
        <Navbar.Offcanvas id="header" placement="start" className="d-xl-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasMenu">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav>
              <HeaderLinklist />
              <hr />
              <h5>Settings</h5>
              <Nav.Item className="my-1">
                <label htmlFor="theme-switcherPopout">Dark Mode</label>
                <input
                  className="ms-1"
                  type="checkbox"
                  id="theme-switcherPopout"
                  checked={theme === "dark" ? true : false}
                  onChange={switchTheme}
                />
              </Nav.Item>
              <PopoutMenuLogout />
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <Row className="w-100 p-0">
          <Nav className="flex-row w-100 p-0">
            <Col className="d-flex align-items-center p-0" xs="auto">
              <Navbar.Brand href="/" className="ps-1">
                <img src="/calculator.svg" style={{ height: "4rem" }} />
              </Navbar.Brand>
            </Col>

            <Col className=" d-none d-xl-inline-flex flex-grow-1 align-items-center justify-content-evenly nav-text">
              <HeaderLinklist />
            </Col>
            <Col className="d-flex justify-content-center">
              <Form
                className="d-inline-flex ms-auto ms-md-0 flex-grow-1 my-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(
                    `/recipes?search=${
                      document.getElementById("searchBox").value
                    }${pageSize ? `&results=${pageSize}` : ""}`,
                  );
                }}
              >
                <Form.Control
                  type="search"
                  id="searchBox"
                  placeholder="Search"
                  className="mainSearchBox me-2"
                  aria-label="Search"
                  defaultValue={searchQuery ? searchQuery : ""}
                />
                {/* <SearchIcon
                  className="align-self-md-center my-auto text-secondary"
                  fontSize="large"
                /> */}
              </Form>
            </Col>
            <Col
              className="d-xl-none d-flex align-items-center justify-content-end"
              xs="auto"
            >
              <Navbar.Toggle aria-controls="header" className="mx-1" />
            </Col>
            <Col
              xs="auto"
              className=" d-none d-xl-inline-flex  align-items-center nav-text"
            >
              <NavDropdown
                title="Settings"
                id="settings"
                align="end"
                className="nav-drop me-1"
              >
                {isAuthenticated ? (
                  <NavDropdown.Item href="/profile" className="nav-drop">
                    Profile{" "}
                  </NavDropdown.Item>
                ) : (
                  ""
                )}

                <NavDropdown.Item
                  className="d-flex align-items-center justify-content-between nav-drop"
                  onClick={() => {
                    switchTheme();
                  }}
                >
                  {" "}
                  <DarkModeIcon />
                  Dark Mode
                  <input
                    className="ms-1"
                    type="checkbox"
                    id="theme-switcher"
                    onChange={(e) => e.preventDefault()}
                    checked={theme === "dark" ? true : false}
                  />
                </NavDropdown.Item>

                <hr />
                {isAuthenticated ? (
                  <NavDropdown.Item
                    className="nav-drop mt-0 pt-0"
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin,
                        },
                      })
                    }
                  >
                    Log Out
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item
                    className="nav-drop mt-0 pt-0"
                    onClick={loginWithPopup}
                  >
                    Log In
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Col>
          </Nav>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;
