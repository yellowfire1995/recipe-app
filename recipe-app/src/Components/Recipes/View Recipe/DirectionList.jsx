import ListGroup from "react-bootstrap/ListGroup";
import { useRecipeContext } from "../RecipeContextProvider";

export function DirectionList() {
  const { recipe } = useRecipeContext();

  if (recipe.directions.length > 0) {
    return (
      <ListGroup variant="flush" className="d-flex">
        <h4> Directions </h4>
        <ol>
          {recipe.directions.map((direction) => {
            return (
              <p key={direction.id}>
                <li>{`${direction.step}`}</li>
              </p>
            );
          })}
        </ol>
      </ListGroup>
    );
  }
}
