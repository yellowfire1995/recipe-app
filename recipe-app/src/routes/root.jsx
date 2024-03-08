import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../Components/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";

export async function action({ params, request }) {
  return redirect(`/`);
}

export default function App() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    addAccessTokenInterceptor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);
  return (
    <div>
      <Row className="">
        <Header />
      </Row>
      <Container className="pt-3">
        <Row>
          <Outlet />
        </Row>
      </Container>
    </div>
  );
}
