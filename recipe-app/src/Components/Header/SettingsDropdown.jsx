import { useAuth0 } from "@auth0/auth0-react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { NavDropdown } from "react-bootstrap";

export function SettingsDropdown({ theme, switchTheme }) {
  const { logout, isAuthenticated, loginWithPopup } = useAuth0();
  return (
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
  );
}
