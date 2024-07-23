import { useRouteError } from "react-router-dom";
import Header from "../Header/Header";
import { GeneralError } from "./GeneralError";
import { Error404 } from "./Error404";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/esm/Container";

export default function RouteErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorElement = <GeneralError error={error} />;

  if (error.status == 404) {
    errorElement = <Error404 error={error} />;
  }

  return (
    <>
      <Header />
      <Container>
        <Row className="d-flex">
          <Col>{errorElement}</Col>
        </Row>
      </Container>
    </>
  );
}
