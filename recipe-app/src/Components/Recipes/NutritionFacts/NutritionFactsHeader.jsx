import { handleServingsUpdate } from "../../../utils/NutritionFacts/handleServingsUpdate";
import { useRecipeContext } from "../RecipeContextProvider";

export function NutritionFactsHeader() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <header className="performance-facts__header">
      <h1 className="performance-facts__title">Nutrition Facts</h1>
      {recipe.yieldNumber ? (
        <p>{`Yield ${recipe.yieldNumber} ${recipe.yieldDescription}`}</p>
      ) : (
        ""
      )}
      <p>
        Servings
        <input
          key={recipe.scaleFactor}
          type="number"
          id="servings"
          min="1"
          defaultValue={recipe.servings}
          onChange={(event) =>
            setRecipe(handleServingsUpdate({ event, recipe }))
          }
          style={{ width: "2rem" }}
          className="ms-1"
        />
      </p>
    </header>
  );
}
