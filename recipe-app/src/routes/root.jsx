import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header.jsx";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "../Components/Loading.jsx";
import { ToastContainer } from "react-toastify";
import { Footer } from "../Components/Footer/Footer.jsx";
import Row from "react-bootstrap/esm/Row.js";
import Col from "react-bootstrap/esm/Col.js";
import Stack from "react-bootstrap/Stack";

import Container from "react-bootstrap/esm/Container.js";

export default function App() {
  const { getAccessTokenSilently, isLoading, isAuthenticated, error } =
    useAuth0();

  if (isLoading) {
    return (
      <>
        <Stack gap={3} style={{ minHeight: "100vh" }}>
          <Header />
          <Loading />
          <div className="break"></div>
        </Stack>
      </>
    );
  }

  if (error) {
    console.log(error);
  }

  if (!isLoading) {
    addAccessTokenInterceptor({ getAccessTokenSilently, isAuthenticated });
    return (
      <>
        <Stack gap={3} style={{ minHeight: "100vh" }}>
          <Header />
          <Outlet />

          <Footer />
        </Stack>
        <ToastContainer position="bottom-right" />
      </>
    );
  }
}
