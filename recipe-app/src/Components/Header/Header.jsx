import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Col from "react-bootstrap/esm/Col";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import Row from "react-bootstrap/esm/Row";
import NavDropdown from "react-bootstrap/NavDropdown";

import useLocalStorage from "../../utils/useLocalStorage";
import { HamburgerMenu } from "./HamburgerMenu";
import { HeaderLinklist } from "./HeaderLinkList";
import { SearchBox } from "./SearchBox";

function Header() {
  const { logout, isAuthenticated, loginWithPopup } = useAuth0();

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

  return (
    <Navbar expand="xl" sticky="top" className="bg-nav p-0 w-100">
      <Container fluid className="px-0 justify-content-center">
        <HamburgerMenu theme={theme} switchTheme={switchTheme} />
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
                }}
              >
                <SearchBox />
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
