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
