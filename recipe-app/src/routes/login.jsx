import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import LoginButton from "../utils/LoginButton";

export default function Login() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    isAuthenticated ? navigate("/recipes") : null;
  }, [isAuthenticated]);

  return (
    <div className="login">
      <Container fluid className="vh-100 text-center">
        <Row className="align-items-center vh-100">
          <Col md></Col>
          <Col md lg={2}>
            <LoginButton />
          </Col>
          <Col md lg={2}></Col>
        </Row>
      </Container>
    </div>
  );
}
