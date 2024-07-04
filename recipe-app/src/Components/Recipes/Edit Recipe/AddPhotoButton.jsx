import Button from "react-bootstrap/Button";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export function AddPhotoButton() {
  return (
    <Row className="">
      <Col className="text-start p-0">
        <Button size="sm" style={{ width: "9rem" }}>
          <CameraAltIcon /> Add photo
        </Button>
      </Col>
    </Row>
  );
}
