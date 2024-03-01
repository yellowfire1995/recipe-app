import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const PrivateRoutes = () => {
  let { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
