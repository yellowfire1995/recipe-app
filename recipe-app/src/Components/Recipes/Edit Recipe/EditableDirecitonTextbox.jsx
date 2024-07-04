import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { useRecipeContext } from "../RecipeContextProvider";
import { parseDirections } from "../../../../db/queries";

export function EditableDirectionTextbox() {
  const [directions, setDirections] = useState("");
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
            required
            as="textarea"
            rows={10}
            value={directions}
            onChange={(e) => setDirections(e.target.value)}
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
                directions: await parseDirections(directions),
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
