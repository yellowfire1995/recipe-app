import { useAuth0 } from "@auth0/auth0-react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Rating } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteRating, updateRating } from "../../../../db/queries";
import logger from "../../../utils/logger";

export function RecipeRating({
  recipe = {},
  value = recipe.userRating || recipe.rating || null,
  refetch = () => {
    return recipe;
  },
  showCount = false,
  showRatingNumber = false,
  // eslint-disable-next-line no-unused-vars
  setRecipe,
  ...props
}) {
  const { userRating, rating, ratingCount, recipeId } = recipe;
  const recipeRating = _.round(rating, 1).toFixed(1);
  const [color, setColor] = useState(userRating ? "#c4361e" : "");
  const [precision, setPrecision] = useState(0.5);
  const { isAuthenticated } = useAuth0();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ recipeId, userRating, deleter }) => {
      if (deleter) {
        return deleteRating(recipeId, userRating);
      }
      return updateRating(recipeId, userRating);
    },
    onError: (error) => {
      logger.log(error);
      toast.error("Error saving rating, please try again.");
    },
  });

  const updateRecipeRating = async (e) => {
    const newRating = parseInt(e.target.value);

    if (newRating === recipe.userRating) {
      await mutateAsync({
        recipeId: recipeId,
        deleter: true,
      });

      refetch();
    } else {
      await mutateAsync({
        recipeId: recipeId,
        userRating: newRating,
        deleter: false,
      });

      refetch();
    }
  };

  return (
    <>
      {showRatingNumber && rating && recipeRating}
      <Rating
        emptyIcon={
          <StarBorderIcon className="empty-rating-icon" fontSize="inherit" />
        }
        disabled={isPending}
        precision={precision}
        onMouseEnter={() => {
          isAuthenticated ? setColor("#c4361e") : "";
          setPrecision(1);
        }}
        onMouseLeave={() => {
          recipe.userRating ? "" : setColor("");
          setPrecision(0.5);
        }}
        style={{
          color: color,
          lineHeight: ".5em",
          marginLeft: "0px",
        }}
        value={_.round(value, 1)}
        readOnly={!isAuthenticated}
        onChange={(e) => {
          updateRecipeRating(e);
        }}
        {...props}
      />
      {(showCount &&
        ratingCount > 0 &&
        `${ratingCount} rating${ratingCount !== 1 ? "s" : ""} `) ||
        (showCount && "No ratings")}
    </>
  );
}
