import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { savePrice } from "../../db/queries";
import { ImportSelector } from "./importSelector";
import { parseIngredients } from "../../db/queries";
import Form from "react-bootstrap/Form";
import { Container } from "@mui/material";

export default function EditIngredientModal(props) {
  const origIdx = props.origIdx;
  const useElement = (id) => document.getElementById(id);
  const [ingredientList, setIngredientList] = props.ingredientList;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [ingredient, setIngredient] = useState(props.ingredient);
  const [show, setShow] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const handleClose = () => {
    setShow(false);
    setIngredient(props.ingredient);
    setSearchList([]);
  };

  const handleShow = () => {
    setIngredient(props.ingredient);
    setShow(true);
  };

  useEffect(() => {
    if (searchList.length > 0) {
      setIngredient(searchList[0][0]);
    }
  }, [searchList]);

  function handleSave() {
    setUpdatedRecipe({
      ...updatedRecipe,
      ingredients: updatedRecipe.ingredients.map((recipeIngredient, index) => {
        if (index == origIdx) {
          return ingredient;
        } else {
          return { ...recipeIngredient };
        }
      }),
    });

    setIngredientList(
      ingredientList.map((ingredient, index) => {
        if (index == origIdx) {
          return searchList[0];
        } else {
          return [...ingredient];
        }
      })
    );

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
            Set density for {ingredient.description} {origIdx}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="weightDescription">Measurement description:</label>{" "}
          <input
            name="weightDescription"
            type="textbox"
            value={
              ingredient.userLabel
                ? ingredient.userLabel
                : ingredient.unitOfMeasure
                ? ingredient.unitOfMeasure
                : ingredient.engLabel
            }
            onChange={(e) =>
              setIngredient({ ...ingredient, userLabel: e.target.value })
            }
            id="weightDescription"
          />
          <br />
          <label htmlFor="cost">Measurement weight in grams:</label>
          <input
            type="number"
            id="weight"
            min="0"
            step="1"
            size="5"
            value={
              Math.round(
                (1 / (ingredient.userG || ingredient.gramConversion)) * 100
              ) / 100
            }
            onChange={(e) =>
              setIngredient({
                ...ingredient,
                userG: 1 / e.target.value,
              })
            }
          />
          <br />
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
          <br />
          {ingredient.fdc_id ? (
            <a
              href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${ingredient.fdc_id}/nutrients`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          ) : null}
          <hr />
          <h5>Change Ingredient</h5>
          <Container className="p-0 m-0 d-flex">
            <Form.Control
              id="searchModal"
              type="textbox"
              placeholder="Enter new ingredient (e.g. 1 cup flour)"
            />
            <Button
              id="searchButton"
              type="button"
              htmlFor="search"
              onClick={async (e) => {
                setSearchList(
                  await parseIngredients(useElement("searchModal").value)
                );
              }}
            >
              Search
            </Button>
          </Container>
          <br />
          {ingredientList[origIdx] || searchList.length > 0 ? (
            <ImportSelector
              ingredient={[ingredient, setIngredient]}
              ingredientList={
                searchList.length > 0 ? searchList[0] : ingredientList[origIdx]
              }
              origIdx={origIdx}
            />
          ) : (
            ""
          )}
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
