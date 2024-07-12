import { useAuth0 } from "@auth0/auth0-react";
import Nav from "react-bootstrap/Nav";

export function PopoutMenuLogout() {
  const { isAuthenticated, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <>
        <Nav.Link href="/profile">Profile</Nav.Link>
        <Nav.Link
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
        </Nav.Link>
      </>
    );
  }
}
