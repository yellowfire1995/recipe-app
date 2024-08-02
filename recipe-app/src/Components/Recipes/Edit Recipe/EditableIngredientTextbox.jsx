import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { useRecipeContext } from "../RecipeContextProvider";
import { parseIngredients } from "../../../../db/queries";

export function EditableIngredientTextbox() {
  const { recipe, setRecipe } = useRecipeContext();

  async function getIngredientChoices() {
    const choices = await parseIngredients(
      document.getElementById("ingredientText").value.toString()
    );

    setRecipe({
      ...recipe,
      ingredients: choices.map((choice) => {
        return { ...choice[0], searchArray: choice };
      }),
    });

    return choices;
  }

  return (
    <>
      <Row>
        <Col>
          <h3> Ingredients </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          {" "}
          <Form.Control
            key={recipe.ingredientText}
            id="ingredientText"
            as="textarea"
            className="table-active"
            rows={10}
            defaultValue={recipe.ingredientText}
            placeholder="Enter ingredients- one ingredient per line:&#10;1 cup flour&#10;2 ounces butter, softened "
          />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex">
          <Button
            className="flex-grow-1 bg-color-red border-0"
            variant="primary"
            onClick={async () => {
              await getIngredientChoices();
            }}
          >
            Add Ingredients
          </Button>
        </Col>
      </Row>
    </>
  );
}
