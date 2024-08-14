import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { useRecipeHeaderButtonsContext } from "../Recipe Header/Buttons/RecipeHeaderButtonsContext";

export function RemixButton() {
  const navigate = useNavigate();
  const { recipe } = useRecipeHeaderButtonsContext();

  return (
    <Button onClick={() => navigate(`/newrecipe?copy=${recipe.recipeId}`)}>
      Remix
    </Button>
  );
}
