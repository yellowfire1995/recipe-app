import imageCompression from "browser-image-compression";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useRecipeContext } from "../RecipeContextProvider";

export function AddPhotoPopup({ setShowPopup, showPopup }) {
  const { recipe, setRecipe } = useRecipeContext();
  const [photoFile, setPhotoFile] = useState();
  const [photoUrl, setPhotoUrl] = useState(recipe.imgUrl);
  const handleClose = () => {
    setPhotoFile();
    setPhotoUrl();
    setShowPopup(!showPopup);
  };

  return (
    <Modal show={showPopup} onHide={handleClose} animation={true} size="lg">
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
          onClick={async () => {
            if (photoUrl) {
              setRecipe({
                ...recipe,
                imgUrl: document.getElementById("photoUrl").value,
                imgFile: null,
              });

              handleClose();
            } else if (photoFile) {
              const originalImageFile =
                document.getElementById("photoFile").files[0];
              const compressedImage = await imageCompression(
                originalImageFile,
                { maxSizeMB: 5, useWebWorker: true },
              );
              setRecipe({
                ...recipe,
                imgUrl: URL.createObjectURL(compressedImage),
                imgFile: compressedImage,
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
  );
}
