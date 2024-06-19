import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { ImportSelector } from "./importSelector.jsx";

export default function ImportIngredientsList(props) {
  const [ingredientList, setIngredientList] = props.ingredientList;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  return (
    <Container>
      <ListGroup>
        <InputGroup name="ingredients" className="d-flex flex-column py-4">
          {ingredientList.map((ingredientChoices, idx) => {
            return (
              <ImportSelector
                updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                ingredients={ingredientChoices}
                origIdx={idx}
              />
            );
          })}
        </InputGroup>
      </ListGroup>
    </Container>
  );
}
