import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../Components/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, redirect } from "react-router-dom";

export async function action({ params, request }) {
  return redirect(`/`);
}

export default function App() {
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
