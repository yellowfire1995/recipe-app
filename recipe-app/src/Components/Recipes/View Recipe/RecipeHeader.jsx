import { useRecipeContext } from "../RecipeContextProvider";
import Col from "react-bootstrap/esm/Col";

export function RecipeHeader({ price, buttons, credit }) {
  const { recipe } = useRecipeContext();

  return (
    <>
      <Col lg={10}>
        <h2>
          {recipe.name} - {price}
          {buttons}
        </h2>
      </Col>
      <Col className="text-end">{credit}</Col>
      <hr />
    </>
  );
}
