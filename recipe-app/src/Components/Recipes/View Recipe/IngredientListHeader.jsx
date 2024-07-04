export function IngredientListHeader({ ingredient }) {
  return <h4 key={ingredient.id}>{ingredient.description.toUpperCase()}</h4>;
}
