export function IngredientListHeader({ ingredient }) {
  const ingredientDescription =
    ingredient.userIngredientName || ingredient.description;

  return <h4 key={ingredient.id}>{ingredientDescription.toUpperCase()}</h4>;
}
