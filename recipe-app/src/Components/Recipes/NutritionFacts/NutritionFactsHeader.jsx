import { useRecipeContext } from "../RecipeContextProvider";

function handleServingsUpdate({ recipe, event }) {
  if (!event.target.valueAsNumber) {
    return recipe;
  }
  const yieldRatio = recipe.yieldNumber / recipe.servings;
  const updatedIngredients = recipe.ingredients.map((ingredient) => {
    return {
      ...ingredient,
      quantity:
        (ingredient.quantity / recipe.servings) * event.target.valueAsNumber ||
        recipe.servings,
    };
  });

  return {
    ...recipe,
    servings: event.target.valueAsNumber || recipe.servings,
    yieldNumber: recipe.yieldNumber
      ? yieldRatio * event.target.valueAsNumber || recipe.servings
      : null,
    ingredients: updatedIngredients,
  };
}

export function NutritionFactsHeader() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <header className={`performance-facts__header`}>
      <h1 className="performance-facts__title">Nutrition Facts</h1>
      {recipe.yieldNumber ? (
        <p>{`Yield ${recipe.yieldNumber} ${recipe.yieldDescription}`}</p>
      ) : (
        ""
      )}
      <p>
        Servings per Recipe
        <input
          type="number"
          id="servings"
          min="1"
          defaultValue={recipe.servings}
          onChange={(event) =>
            setRecipe(handleServingsUpdate({ event, recipe }))
          }
          style={{ width: "3rem" }}
          className="me-2"
        />
      </p>
    </header>
  );
}
