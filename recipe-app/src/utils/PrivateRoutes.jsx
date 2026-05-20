import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

export function PrivateRoutes() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <div>Loading ...</div>;

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname },
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
      },
    });
    return null;
  }

  return <Outlet />;
}

export default PrivateRoutes;
