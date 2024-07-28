import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { useRecipeContext } from "../RecipeContextProvider";
import { parseDirections } from "../../../../db/queries";

export function EditableDirectionTextbox() {
  const { recipe, setRecipe } = useRecipeContext();
  return (
    <>
      <Row>
        <Col>
          <h3> Directions </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control
            id="directionText"
            required
            as="textarea"
            rows={10}
            defaultValue={recipe.directionText}
            placeholder="Enter directions"
          />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex">
          <Button
            variant="primary"
            className="flex-grow-1"
            onClick={async () => {
              setRecipe({
                ...recipe,
                directions: await parseDirections(
                  document.getElementById("directionText").value
                ),
              });
            }}
          >
            Add Directions
          </Button>
        </Col>
      </Row>
    </>
  );
}
