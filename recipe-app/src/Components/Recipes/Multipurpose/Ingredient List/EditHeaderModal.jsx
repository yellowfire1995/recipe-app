import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditHeaderModal({
  origIdx,
  recipe,
  setRecipe,
  ingredient: originalIngredient,
  ...props
}) {
  const [ingredient, setIngredient] = useState(originalIngredient);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setIngredient(originalIngredient);
  };

  const handleShow = () => {
    setIngredient(originalIngredient);
    setShow(true);
  };

  function handleSave() {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.map((recipeIngredient, index) => {
        if (index == origIdx) {
          return ingredient;
        } else {
          return { ...recipeIngredient };
        }
      }),
    });

    handleClose();
  }

  return (
    <>
      <EditIcon onClick={handleShow} className="svg-icon" />
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change header for {ingredient.description}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="ingredientDescription">Ingredient description:</label>
          <input
            name="ingredientDescription"
            type="textbox"
            value={ingredient.description}
            onChange={(e) =>
              setIngredient({ ...ingredient, description: e.target.value })
            }
            id="ingredientDescription"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
