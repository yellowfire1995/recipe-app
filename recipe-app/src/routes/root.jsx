import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header.jsx";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const { getAccessTokenSilently, isLoading, isAuthenticated, error } =
    useAuth0();

  if (isLoading) {
    console.log("loading...");
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  }

  if (error) {
    console.log(error);
  }

  if (!isLoading) {
    console.log("loaded auth");
    addAccessTokenInterceptor({ getAccessTokenSilently, isAuthenticated });
    return (
      <>
        <Header />

        <Outlet />
      </>
    );
  }
}
