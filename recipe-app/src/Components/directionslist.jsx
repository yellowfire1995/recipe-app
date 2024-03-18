import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import Form from "react-bootstrap/Form";

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

export default function DirectionsList(props) {
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  return (
    <Container>
      <span className="h3"> Directions </span>
      <ol className="d-flex flex-column">
        {updatedRecipe.directions.map((direction) => {
          return (
            <div key={direction.id}>
              <li>
                <Form.Control
                  key={direction.step_num}
                  id={direction.step_num}
                  as="textarea"
                  rows={3}
                  defaultValue={`${direction.step}`}
                  onChange={(e) =>
                    setUpdatedRecipe(handleDirectionsUpdate(updatedRecipe, e))
                  }
                  style={{ width: "90%" }}
                />
              </li>
              <Button
                key={direction.step_num}
                id={direction.step_num}
                aria-label="delete"
                type="button"
                onClick={(e) =>
                  setUpdatedRecipe(deleteDirection(updatedRecipe, e))
                }
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
        className="p-1"
        onClick={() => setUpdatedRecipe(addNewDirection(updatedRecipe))}
      >
        Add New Step
      </Button>
    </Container>
  );
}
