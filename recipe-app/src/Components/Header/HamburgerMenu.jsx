import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import { HeaderLinklist } from "./HeaderLinkList";
import { PopoutMenuLogout } from "./PopoutMenuLogout";

export function HamburgerMenu({ theme, switchTheme }) {
  return (
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
  );
}
