import { GeneralError } from "./GeneralError";
import { Error404 } from "./Error404";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";

export default function AppErrorPage({ error }) {
  console.error(error);

  let errorElement = <GeneralError error={error} />;

  if (error.status == 404) {
    errorElement = <Error404 error={error} />;
  }

  return (
    <>
      <Container>
        <Row className="d-flex">
          <Col>{errorElement}</Col>
        </Row>
      </Container>
    </>
  );
}
