import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export function RemixButton({ recipe }) {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(`/newrecipe?copy=${recipe.recipeId}`)}>
      Remix
    </Button>
  );
}
