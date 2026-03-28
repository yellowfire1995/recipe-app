const ingredientSynonyms = {
  milk: "whole milk",
  flour: "all purpose flour",
  "white sugar": "sugars, granulated",
  sugar: "sugars, granulated",
  eggs: "egg",
};

export function fixIngredient(ingredient) {
  const lower = ingredient.toLowerCase();
  return ingredientSynonyms[lower]
    ? `${ingredientSynonyms[lower]}`
    : ingredient;
}
