import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import logger from "./logger";

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  logger.log(window.location.href + location.pathname);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
