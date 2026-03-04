import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { photoImport } from "../../../../db/queries";
import { useRecipeContext } from "../RecipeContextProvider";

export function AddRecipeScanPopup({ setShowPopup, showPopup }) {
  const { recipe, setRecipe } = useRecipeContext();
  const [scanPictures, setScanPictures] = useState();
  const [fileArray, setFileArray] = useState(null);
  const [fileList, setFileList] = useState();
  const handleClose = () => {
    setScanPictures();
    setShowPopup(!showPopup);
  };

  return (
    <Modal show={showPopup} onHide={handleClose} animation={true} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Scan Recipe</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Row>
            {fileArray &&
              fileArray.map((scan, idx) => {
                const preview = URL.createObjectURL(scan);
                return (
                  <img key={idx} src={preview} style={{ width: "100px" }} />
                );
              })}
          </Row>
          <Row className="align-items-center">
            <Col>Upload:</Col>
            <Col xs={10} className="d-flex">
              <Form.Control
                id="recipeFile"
                onChange={(e) => {
                  if (e.target.files) {
                    setFileList(e.target.files);
                    setFileArray(Array.from(e.target.files));
                  }
                }}
                className=""
                type="file"
                name="uploadFile"
                accept="image/*"
                multiple
              />
              <Button
                onClick={() => {
                  setFileArray();
                  document.getElementById("recipeFile").value = "";
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
          disabled={!fileArray}
          onClick={async () => {
            const response = await photoImport({
              scanArray: fileArray,
            });
            setRecipe({
              ...recipe,
              ingredientText: response.data.ingredientText,
              directionText: response.data.directionText,
            });
            setShowPopup(false);
            setFileArray();
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
