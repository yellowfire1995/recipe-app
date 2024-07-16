import Container from "react-bootstrap/esm/Container";
import Login from "../../routes/login";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoginButton from "../../utils/LoginButton";

export default function ErrorHandler(props) {
  const error = props.error;
  const status = error.response.status;

  if (status === 404) {
    return (
      <Container className="justify-content-center">
        <h1>{status}!</h1>
        <p>Your request was not found. Please try again.</p>
        <p>
          <i></i>
        </p>
      </Container>
    );
  } else if (status === 401) {
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
              <Col className="d-flex flex-wrap align-items-center justify-content-center">
                <img src="../calculator.svg" style={{ height: "9rem" }} />

                <img
                  src="../logo.svg"
                  className=""
                  style={{ height: "2rem" }}
                />
              </Col>
              <Col className="my-auto">
                <LoginButton />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}
