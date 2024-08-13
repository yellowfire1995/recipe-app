import { ListGroup } from "react-bootstrap";
import { RecipeListItem } from "../Recipes/MultiRecipeViewer/ListView/RecipeListItem";

export default function CollectionRecipes({ collection, refetch }) {
  return (
    <>
      <ListGroup>
        {collection.recipes.map((recipe) => {
          return (
            <RecipeListItem
              key={recipe.recipeId}
              recipe={recipe}
              refetch={refetch}
            />
          );
        })}
      </ListGroup>
    </>
  );
}
