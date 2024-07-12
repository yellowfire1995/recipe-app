import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header.jsx";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "../Components/Loading.jsx";

export default function App() {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (!isLoading) {
    addAccessTokenInterceptor({ getAccessTokenSilently, isAuthenticated });
    return (
      <>
        <Header />

        <Outlet />
      </>
    );
  }
}
