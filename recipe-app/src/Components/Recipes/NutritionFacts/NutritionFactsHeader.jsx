import { useNutritionFactsContext } from "./NutritionFactsContext";

function handleServingsUpdate({ recipe, event }) {
  if (!event.target.valueAsNumber) {
    return recipe;
  }
  const yieldRatio = recipe.yieldNumber / recipe.servings;
  const updatedIngredients = recipe.ingredients.map((ingredient) => {
    return {
      ...ingredient,
      quantity:
        (ingredient.quantity / recipe.servings) * event.target.valueAsNumber,
    };
  });

  return {
    ...recipe,
    servings: event.target.valueAsNumber,
    yieldNumber: yieldRatio * event.target.valueAsNumber,
    ingredients: updatedIngredients,
  };
}

export function NutritionFactsHeader() {
  const { recipe, setRecipe } = useNutritionFactsContext();

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
          value={recipe.servings}
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
