import EditIcon from "@mui/icons-material/Edit";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { parseIngredients } from "../../../../../../db/queries";
import { ImportSelector } from "../../../New Recipe/importSelector";
import { NutritionFacts } from "../../../NutritionFacts/NutritionFacts";
import { useRecipeContext } from "../../../RecipeContextProvider";

export default function EditIngredientModal({
  ingredient: initialIngredient,
  origIdx,
}) {
  const element = (id) => document.getElementById(id);
  const { recipe, setRecipe } = useRecipeContext();
  const [show, setShow] = useState(initialIngredient.newIngredient);
  const [ingredient, setIngredient] = useState(initialIngredient);
  const [searchArray, setSearchArray] = useState(initialIngredient.searchArray);

  useEffect(() => {
    setIngredient(initialIngredient);
  }, [initialIngredient]);

  const handleClose = () => {
    setShow(false);
    setIngredient(initialIngredient);
    setSearchArray(initialIngredient.searchArray);
  };

  const handleShow = () => {
    setShow(true);
  };

  function handleSave() {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.map((recipeIngredient, index) => {
        if (index === origIdx) {
          return {
            ...ingredient,
            ingredientVersion: ingredient.ingredientVersion + 1 || 1,
          };
        } else {
          return { ...recipeIngredient };
        }
      }),
    });

    setShow(false);
  }

  function formatWeight(denomenator) {
    return Math.round((1 / denomenator) * 100) / 100 || "";
  }

  function handleWeightChange(e) {
    const newGramWeight = e.target.valueAsNumber;
    const isValidWeight = !isNaN(newGramWeight);

    if (isValidWeight) {
      const newGramDenomenator = 1 / newGramWeight;
      const conversionRatio = (ingredient.userG || 1) / newGramDenomenator;
      setIngredient({
        ...ingredient,
        userG: newGramDenomenator,
        quantity: ingredient.quantity * conversionRatio,
      });
    } else {
      setIngredient({
        ...ingredient,
        userG: "",
        quantity: ingredient.quantity * (ingredient.userG || 1),
      });
    }
  }

  return (
    <>
      <EditIcon onClick={handleShow} className="svg-icon" />
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit {ingredient.description}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="weightDescription">Measurement description:</label>{" "}
          <input
            name="weightDescription"
            type="textbox"
            value={ingredient.userLabel ?? ""}
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
            value={formatWeight(ingredient.userG)}
            onChange={handleWeightChange}
          />
          <br />
          <label htmlFor="ingredientDescription">
            Original ingredient name:
          </label>
          <input
            name="ingredientDescription"
            type="textbox"
            value={ingredient.userIngredientName}
            onChange={(e) =>
              setIngredient({
                ...ingredient,
                userIngredientName: e.target.value,
              })
            }
            id="ingredientDescription"
          />
          <br />
          <Form.Check
            type="switch"
            id="showOriginalName"
            label="Show as original ingredient name"
            defaultChecked={recipe.ingredients[origIdx].displayOriginalName}
            onChange={(e) => {
              setIngredient({
                ...ingredient,
                displayOriginalName: e.target.checked,
              });
            }}
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
              onClick={async () => {
                const newArray = await parseIngredients(
                  element("searchModal").value
                );

                if (newArray.length > 0) {
                  setSearchArray(newArray[0]);
                  setIngredient(newArray[0][0]);
                }
              }}
            >
              Search
            </Button>
          </Container>
          <br />
          {searchArray ? (
            <ImportSelector
              ingredient={ingredient}
              setIngredient={setIngredient}
              searchArray={searchArray}
              origIdx={origIdx}
            />
          ) : (
            ""
          )}
          <NutritionFacts ingredientArray={[ingredient]} servings={1}>
            <NutritionFacts.Table />
          </NutritionFacts>
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
