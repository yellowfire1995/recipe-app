import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";

function LoginButton() {
  const { loginWithPopup } = useAuth0();
  return (
    <>
      <Row className="justify-content-center mb-2">
        <Col className="">
          <Button
            id="loginbtn"
            className="w-100 "
            size="lg"
            onClick={() => loginWithPopup()}
          >
            Login
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="w-100">
          <Button
            className="btn-secondary w-100 "
            size="lg"
            onClick={() =>
              loginWithPopup({ authorizationParams: { screen_hint: "signup" } })
            }
          >
            Sign up
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default LoginButton;
