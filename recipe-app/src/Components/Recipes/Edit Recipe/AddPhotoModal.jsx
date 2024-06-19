import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";

function AddPhotoModal(props) {
  const [show, setShow] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [photoFile, setPhotoFile] = useState();
  const [photoUrl, setPhotoUrl] = useState(updatedRecipe.imgUrl);

  const handleClose = () => {
    setShow(false);
    setPhotoFile();
    setPhotoUrl();
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Container
        style={{
          width: "10rem",
          height: "12rem",
        }}
        onClick={() => setShow(true)}
        className="photo-add ps-2"
      >
        <Row>
          <Col className="text-start p-0">
            <img
              src={updatedRecipe.imgUrl}
              style={{
                width: "9rem",
                height: "9rem",
                backgroundColor: "rgb(0,0,0,.3)",
                objectFit: "cover",
              }}
            />
          </Col>
        </Row>
        <Row className="">
          <Col className="text-start p-0">
            <Button size="sm" style={{ width: "9rem" }}>
              <CameraAltIcon /> Add photo
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} animation={true} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Photo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row className="align-items-center">
              <Col>Add via link:</Col>
              <Col xs={10} className="d-flex">
                <Form.Control
                  type="text"
                  id="photoUrl"
                  placeholder="Enter URL"
                  value={photoUrl}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPhotoFile();
                  }}
                  disabled={photoFile ? true : false}
                />
                <Button onClick={() => setPhotoUrl("")}>Clear</Button>
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
              <Col xs={10} className="d-flex">
                <Form.Control
                  id="photoFile"
                  onChange={(e) => {
                    setPhotoUrl();
                    setPhotoFile(e.target.files[0]);
                  }}
                  className=""
                  type="file"
                  name="uploadFile"
                  placeholder="Enter URL"
                  disabled={photoUrl ? true : false}
                  accept="image/*"
                />
                <Button
                  onClick={() => {
                    setPhotoFile();
                    document.getElementById("photoFile").value = "";
                  }}
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            htmlFor="photoUrl"
            type="button"
            onClick={async (e) => {
              if (photoUrl) {
                setUpdatedRecipe({
                  ...updatedRecipe,
                  imgUrl: document.getElementById("photoUrl").value,
                  imgFile: null,
                });

                handleClose();
              } else if (photoFile) {
                setUpdatedRecipe({
                  ...updatedRecipe,
                  imgUrl: URL.createObjectURL(
                    document.getElementById("photoFile").files[0]
                  ),
                  imgFile: document.getElementById("photoFile").files[0],
                });

                handleClose();
              } else {
                alert("Please choose file or add URL");
              }
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddPhotoModal;
