import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <div>Loading ...</div>;

  if (!isAuthenticated) {
    loginWithRedirect({ appState: { returnTo: "/newrecipe" } });
    return <div>Redirecting to login...</div>;
  }

  return <Outlet />;
};

export default PrivateRoutes;
