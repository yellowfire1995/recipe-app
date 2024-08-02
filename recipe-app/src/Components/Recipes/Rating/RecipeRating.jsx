import { useAuth0 } from "@auth0/auth0-react";
import { Rating } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { deleteRating, updateRating } from "../../../../db/queries";
import { toast } from "react-toastify";

export function RecipeRating({
  recipe = {},
  setRecipe = () => {
    return recipe;
  },
  value = recipe.userRating || recipe.rating || null,
  refetch = () => {
    return recipe;
  },
  ...props
}) {
  const { mutateAsync } = useMutation({
    mutationFn: ({ recipeId, userRating, deleter }) => {
      if (deleter) {
        console.log("delete recipe");
        return deleteRating(recipeId, userRating);
      }
      return updateRating(recipeId, userRating);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error saving rating, please try again.");
    },
  });

  const updateRecipeRating = async (e) => {
    const newRating = parseInt(e.target.value);

    if (newRating === recipe.userRating) {
      await mutateAsync({
        recipeId: recipe.recipeId,
        deleter: true,
      });
      setRecipe({ ...recipe, userRating: null });

      refetch();
    } else {
      await mutateAsync({
        recipeId: recipe.recipeId,
        userRating: newRating,
        deleter: false,
      });
      setRecipe({ ...recipe, userRating: newRating });
      refetch();
    }
  };

  const [color, setColor] = useState(recipe.userRating ? "#c4361e" : "");
  const { isAuthenticated } = useAuth0();

  return (
    <Rating
      onMouseEnter={() => (isAuthenticated ? setColor("#c4361e") : "")}
      onMouseLeave={() => (recipe.userRating ? "" : setColor(""))}
      style={{ color: color }}
      value={parseFloat(value)}
      readOnly={!isAuthenticated}
      onChange={(e) => updateRecipeRating(e)}
      {...props}
    />
  );
}
