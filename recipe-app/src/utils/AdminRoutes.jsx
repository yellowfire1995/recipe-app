import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import { roles } from "../../env/env";

const AdminRoutes = () => {
  const { isLoading, user } = useAuth0();
  const isAdmin = user[roles].includes("Admin");

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoutes;
