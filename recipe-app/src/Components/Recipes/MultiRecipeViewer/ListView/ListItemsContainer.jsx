import { ListGroup } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useMultiRecipeViewerContext } from "../MultiRecipeContext";
import { NoRecipes } from "../NoRecipes";
import { RecipeListItem } from "./RecipeListItem";

export function ListItemsContainer({ ...props }) {
  const [searchParams] = useSearchParams();
  const { recipes, refetch } = useMultiRecipeViewerContext();
  const page = searchParams.get("page");

  if (recipes.length < 1) {
    return <NoRecipes />;
  }

  return (
    <ListGroup {...props}>
        {recipes.map((recipe, index) => {
          return (
            <RecipeListItem
              key={`${index} ${page} ${recipe.recipeId}`}
              recipe={recipe}
              refetch={refetch}
            />
          );
        })}{" "}
      </ListGroup>
  );
}
