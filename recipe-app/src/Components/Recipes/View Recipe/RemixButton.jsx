import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { useRecipeContext } from "../RecipeContextProvider";

export function RemixButton() {
  const { recipe } = useRecipeContext();
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(`/newrecipe?copy=${recipe.recipeId}`)}>
      Remix
    </Button>
  );
}
