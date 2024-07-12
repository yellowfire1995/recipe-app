import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { useRecipeContext } from "../RecipeContextProvider";
import { useAuth0 } from "@auth0/auth0-react";

export function EditRecipeButton() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const { recipe } = useRecipeContext();

  if (user.sub == recipe.author) {
    return (
      <Button onClick={() => navigate(`/recipes/${recipe.recipeId}/edit`)}>
        Edit
      </Button>
    );
  }
}
