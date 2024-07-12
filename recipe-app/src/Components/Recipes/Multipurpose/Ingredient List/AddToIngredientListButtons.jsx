import Button from "react-bootstrap/esm/Button";
import { useRecipeContext } from "../../RecipeContextProvider";
import { v4 as uuidv4 } from "uuid";

export function AddToIngredientListButtons() {
  const { recipe, setRecipe } = useRecipeContext();
  return (
    <>
      <div className="d-flex">
        <Button
          type="button"
          className="w-100"
          onClick={() => {
            setRecipe({
              ...recipe,
              ingredients: [
                ...recipe.ingredients,
                {
                  description: "New Ingredient",
                  id: uuidv4(),
                  nutrients: [],
                },
              ],
            });
          }}
        >
          Add ingredient
        </Button>
        <Button
          type="button"
          className="w-100"
          onClick={() => {
            setRecipe({
              ...recipe,
              ingredients: [
                ...recipe.ingredients,
                {
                  description: "New Header",
                  id: uuidv4(),
                  nutrients: [],
                  isGroupHeader: true,
                },
              ],
            });
          }}
        >
          Add header
        </Button>
      </div>
    </>
  );
}
