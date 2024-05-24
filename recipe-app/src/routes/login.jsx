import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import LoginButton from "../utils/LoginButton";
import { Helmet } from "react-helmet";

export default function Login() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    isAuthenticated ? navigate("/recipes") : null;
  }, [isAuthenticated]);

  return (
    <>
      <Helmet>
        <title>CookbookCalc | Login</title>
      </Helmet>
      <Row className="align-items-center vh-100 justify-content-center mx-2">
        <Col
          className="d-flex text-center login p-4 align-items-center"
          style={{ height: "20rem" }}
        >
          <Row className="w-100">
            <Col
              className="d-flex align-items-center justify-content-center w-100"
              xs="auto"
            >
              <img src="./logo.svg" className="" style={{ height: "2rem" }} />
              <img src="./calculator.svg" style={{ height: "9rem" }} />
            </Col>
            <Col className="">
              <LoginButton />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
