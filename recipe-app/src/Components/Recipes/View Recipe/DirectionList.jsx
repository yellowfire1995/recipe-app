import { Form } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useWakeLock } from "react-screen-wake-lock";
import { useRecipeContext } from "../RecipeContextProvider";

export function DirectionList() {
  const { recipe } = useRecipeContext();

  const { isSupported, released, request, release } = useWakeLock();

  if (recipe.directions.length > 0) {
    return (
      <ListGroup variant="flush" className="d-flex">
        <h3> Directions </h3>
        <Form.Check
    
          type="switch"
          id="custom-switch"
          label={
            isSupported
              ? "Keep Screen On"
              : "Keep Screen On (browser not supported)"
          }
          defaultValue={!released}
          onClick={() => (released === false ? release() : request())}
          disabled={!isSupported}
        />
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
