import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { scrapeRecipe } from "../../db/queries";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { Container } from "@mui/material";

function AddPhotoModal(props) {
  const [show, setShow] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        type="button"
        size="lg"
        className=""
        style={{
          width: "12rem",
          height: "12rem",
          backgroundImage: updatedRecipe.img_url
            ? `url('${updatedRecipe.img_url}')`
            : null,
          backgroundSize: "cover",
        }}
        onClick={() => setShow(true)}
      >
        <CameraAltIcon /> <br />
        Add photo
      </Button>

      <Modal show={show} onHide={handleClose} animation={true} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Photo</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            setUpdatedRecipe({
              ...updatedRecipe,
              img_url: e.target.photoUrl.value,
            });
            handleClose();
          }}
        >
          <Modal.Body>
            <Container>
              <Row className="align-items-center">
                <Col>Add via link:</Col>
                <Col xs={10}>
                  <Form.Control
                    className=""
                    type="text"
                    name="photoUrl"
                    placeholder="Enter URL"
                  />
                </Col>
              </Row>
              <Row className="w-100 justify-content-center">
                <Col className="breaker-bar">
                  {" "}
                  <h5>OR</h5>{" "}
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col>Upload:</Col>
                <Col xs={10}>
                  <Form.Control
                    className=""
                    type="file"
                    name="uploadFile"
                    placeholder="Enter URL"
                  />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddPhotoModal;
