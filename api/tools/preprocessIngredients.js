export default function preprocessIngredients(ingredients) {
  const filteredIngredients = ingredients.replace(/^[• ]/gm, "");
  return filteredIngredients;
}
