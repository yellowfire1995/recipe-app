import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { scrapeRecipe } from "../../db/queries";

function ImportRecipeModal(props) {
  const [show, setShow] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" className="w-100" onClick={handleShow}>
        Add Recipe from Link
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Import Recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            className=""
            type="text"
            id="importURL"
            placeholder="Enter URL"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={async (e) => {
              setUpdatedRecipe({
                ...updatedRecipe,
                url: document.getElementById("importURL").value,
              });
              props.handleImport(
                await scrapeRecipe(document.getElementById("importURL").value)
              );
              handleClose();
            }}
          >
            Import
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ImportRecipeModal;
