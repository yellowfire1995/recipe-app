import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, redirect } from "react-router-dom";
import Header from "../Components/Header.jsx";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";
import "bootstrap/dist/css/bootstrap.min.css";

export async function action() {
  return redirect(`/`);
}

export default function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    addAccessTokenInterceptor(getAccessTokenSilently);
  }

  return (
    <>
      <Header />

      <Outlet />
    </>
  );
}
