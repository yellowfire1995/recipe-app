import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import LoginButton from "../utils/LoginButton";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(isLoading);

  return (
    <Container className="vh-100 text-center">
      <Row className="align-items-center vh-100">
        <Col className="">
          <LoginButton />
        </Col>
      </Row>
    </Container>
  );
}
