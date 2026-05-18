import { useAuth0 } from "@auth0/auth0-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Stack from "react-bootstrap/Stack";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";
import { Footer } from "../Components/Footer/Footer.jsx";
import Header from "../Components/Header/Header.jsx";
import Loading from "../Components/Loading.jsx";
import logger from "../utils/logger.js";

export default function App() {
  const { getAccessTokenSilently, isLoading, isAuthenticated, error } =
    useAuth0();

  if (isLoading) {
    return (
      <Stack gap={3} className="p-0" style={{ minHeight: "100vh" }}>
        <Header />
        <Loading />
      </Stack>
    );
  }

  if (error) {
    logger.log(error);
  }

  addAccessTokenInterceptor({ getAccessTokenSilently, isAuthenticated });
  return (
    <>
      <Stack style={{ minHeight: "100vh" }}>
        <Header />
        <Outlet />

        <Footer />
      </Stack>
      <ToastContainer position="bottom-right" />
    </>
  );
}
