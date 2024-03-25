import { useState } from "react";
import ScaleIcon from "@mui/icons-material/Scale";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { savePrice } from "../../db/queries";

export default function AddDensityPopup(props) {
  const i = props.ingredient;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [show, setShow] = useState(false);
  const [grams, setGrams] = useState(
    i.quantity / (i.gramConversion * i.quantity)
  );
  const [packageDescription, setPackageDescription] = useState(
    i.unitOfMeasure ? i.unitOfMeasure : i.engLabel
  );

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  function handleSave() {
    setUpdatedRecipe({
      ...updatedRecipe,
      ingredients: updatedRecipe.ingredients.map((ingredient) => {
        if (ingredient.id == i.id) {
          return {
            ...ingredient,
            userG: 1 / grams,
            userLabel: packageDescription,
            gramConversion: 1 / grams,
          };
        } else {
          return { ...ingredient };
        }
      }),
    });

    handleClose();
  }

  function handleCancel() {
    handleClose();
    setGrams(i.quantity / (i.gramConversion * i.quantity));
    setPackageDescription(i.unitOfMeasure ? i.unitOfMeasure : i.engLabel);
  }

  return (
    <>
      <ScaleIcon onClick={handleShow} style={{ color: props.color }} />
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Set density for {i.description}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label htmlFor="description">
              Current measurement description:
            </label>{" "}
            <input
              name="description"
              type="textbox"
              value={packageDescription}
              onChange={(e) => {
                setPackageDescription(e.target.value);
              }}
            />
            <br />
            <label htmlFor="cost">Measurement weight in grams:</label>
            <input
              type="number"
              min="0"
              step="1"
              size="5"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              id="weight"
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSave();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
