import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { roles } from "../../../../env/env";
import { useRecipeHeaderButtonsContext } from "../Recipe Header/Buttons/RecipeHeaderButtonsContext";

export function EditRecipeButton() {
  const { recipe } = useRecipeHeaderButtonsContext();
  const { user } = useAuth0();
  const navigate = useNavigate();

  if (user.sub === recipe.author || user[roles].includes("Admin")) {
    return (
      <Button onClick={() => navigate(`/recipes/${recipe.recipeId}/edit`)}>
        Edit
      </Button>
    );
  }
}
