import { parseIngredient } from "parse-ingredient";

export default function preprocessIngredients(ingredients) {
  const filteredIngredients = ingredients.replace(
    /^[• ]|\(.*\)|(room temperature)/gm,
    ""
  );

  const matchedIngredientList = parseIngredient(filteredIngredients);

  const postFilteredIngredients = matchedIngredientList.map((ingredient) => {
    return {
      ...ingredient,
      description: ingredient.description.replace(/,|(\d plus)|\//gm, ""),
    };
  });

  return postFilteredIngredients;
}
