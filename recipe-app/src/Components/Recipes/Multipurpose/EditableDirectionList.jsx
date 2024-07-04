import _ from "lodash";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";
import { useRecipeContext } from "../RecipeContextProvider";

function handleDirectionsUpdate(updatedRecipe, e) {
  return {
    ...updatedRecipe,
    directions: updatedRecipe.directions.map((direction) => {
      if (direction.step_num == e.target.id) {
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
    recipe_id: updatedRecipe.recipe_id,
  };

  const finalRecipe = { ...updatedRecipe.directions.push(step) };
  return { ...updatedRecipe };
}

function deleteDirection(updatedRecipe, e) {
  console.log(e.target.id);
  const deleteRecipe = _.remove(
    updatedRecipe.directions,
    (direction) => direction.step_num == e.target.id
  );

  return { ...updatedRecipe };
}

export default function EditableDirectionsList() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <Container className="mt-4">
      <h3> Directions </h3>
      <ol className="d-flex flex-column">
        {recipe.directions.map((direction) => {
          return (
            <div key={direction.id}>
              <li>
                <Form.Control
                  key={direction.step_num}
                  id={direction.step_num}
                  as="textarea"
                  rows={3}
                  defaultValue={`${direction.step}`}
                  onChange={(e) => setRecipe(handleDirectionsUpdate(recipe, e))}
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
    </Container>
  );
}
