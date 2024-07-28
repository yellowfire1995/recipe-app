import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";

export function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <Container fluid className="footer text-center mt-auto">
      <Row className="d-flex justify-content-center align-items-center">
        <Col>
          <Link to="/contact">Contact Us</Link> | Copyright © {currentYear}. All
          rights reserved
        </Col>
      </Row>
    </Container>
  );
}
