import { useRecipeContext } from "../RecipeContextProvider";

export function handleServingsUpdate({ recipe, event, servingsModifier }) {
  if (!event?.target.valueAsNumber && !servingsModifier) {
    return recipe;
  }
  const newServings =
    event?.target.valueAsNumber || servingsModifier * recipe.servings;
  const yieldRatio = recipe.yieldNumber / recipe.servings;
  const updatedIngredients = recipe.ingredients.map((ingredient) => {
    return {
      ...ingredient,
      quantity:
        (ingredient.quantity / recipe.servings) * newServings ||
        recipe.servings,
    };
  });

  return {
    ...recipe,
    originalServings: recipe.originalServings || recipe.servings,
    servings: newServings || recipe.servings,
    yieldNumber: recipe.yieldNumber
      ? yieldRatio * newServings || recipe.servings
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
