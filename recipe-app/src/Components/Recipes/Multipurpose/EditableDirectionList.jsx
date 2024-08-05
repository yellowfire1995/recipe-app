import _ from "lodash";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";
import { useRecipeContext } from "../RecipeContextProvider";

function handleDirectionsUpdate(updatedRecipe, e, index) {
  return {
    ...updatedRecipe,
    directions: updatedRecipe.directions.map((direction, idx) => {
      if (index === idx) {
        return {
          ...direction,
          step: e.target.value,
        };
      } else {
        return { ...direction };
      }
    }),
  };
}

function addNewDirection(updatedRecipe) {
  const currentLastStep =
    updatedRecipe.directions.length > 0
      ? _.last(updatedRecipe.directions).step_num
      : 0;

  const step = {
    step_num: 1 + currentLastStep,
    step: "",
    recipeId: updatedRecipe.recipeId,
  };

  const finalRecipe = { ...updatedRecipe.directions.push(step) };
  return { ...updatedRecipe };
}

function deleteDirection(updatedRecipe, e) {
  const deleteRecipe = _.remove(
    updatedRecipe.directions,
    (direction) => direction.step_num == e.target.id
  );

  return { ...updatedRecipe };
}

export default function EditableDirectionsList() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      <h3> Directions </h3>
      <ol className="d-flex flex-column mb-0">
        {recipe.directions.map((direction, index) => {
          return (
            <div key={direction.id}>
              <li>
                <Form.Control
                  key={direction.step_num + direction.se}
                  id={direction.step_num}
                  as="textarea"
                  rows={3}
                  value={direction.step}
                  onChange={(e) =>
                    setRecipe(handleDirectionsUpdate(recipe, e, index))
                  }
                  style={{ width: "90%" }}
                />
              </li>
              <Button
                key={direction.step_num}
                id={direction.step_num}
                aria-label="delete"
                type="button"
                onClick={(e) => setRecipe(deleteDirection(recipe, e))}
                className="pt-0 mb-0"
              >
                {" "}
                Delete{" "}
              </Button>
            </div>
          );
        })}
      </ol>
      <Button
        type="button"
        className="w-100"
        onClick={() => setRecipe(addNewDirection(recipe))}
      >
        Add New Step
      </Button>
    </>
  );
}
