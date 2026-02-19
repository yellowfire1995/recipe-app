import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import logger from "../../utils/logger";
import { Error404 } from "./Error404";
import { GeneralError } from "./GeneralError";

export default function AppErrorPage({ error }) {
  logger.error(error);

  let errorElement = <GeneralError error={error} />;

  if (error.status === 404) {
    errorElement = <Error404 error={error} />;
  }

  return (
    <Container>
      <Row className="d-flex">
        <Col>{errorElement}</Col>
      </Row>
    </Container>
  );
}
