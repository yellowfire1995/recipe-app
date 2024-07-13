import Row from "react-bootstrap/esm/Row";
import { useRecipeContext } from "../RecipeContextProvider";
import Col from "react-bootstrap/esm/Col";

export function RecipeHeader({ price, buttons, credit }) {
  const { recipe } = useRecipeContext();

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-between">{credit}</Col>
      </Row>
      <Row>
        {" "}
        <Col className="d-flex flex-wrap">
          <Col xl={8} className="d-flex ">
            <h2>{recipe.name}</h2>
          </Col>
          <Col className="text-nowrap">{buttons}</Col>

          <hr />
          <div className="d-flex">{price}</div>
        </Col>
      </Row>
    </>
  );
}
