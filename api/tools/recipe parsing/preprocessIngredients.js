import { parseIngredient } from "parse-ingredient";

export default function preprocessIngredients(ingredients) {
  //trim list item notations
  const filteredIngredients = ingredients.replace(/^[• ?]|^[▢ ?]/gm, "");

  const matchedIngredientList = parseIngredient(filteredIngredients);

  const postFilteredIngredients = matchedIngredientList.map((ingredient) => {
    return {
      ...ingredient,
      description: ingredient.description.replace(
        / ?\(.*\)|,(?=[^,]*$)(.*)/gim,
        ""
      ), //replaces anything within parenthesis or the last comma group of the ingredient
      comment: ingredient.description.match(/ ?\(.*\)|,(?=[^,]*$)(.*)/gi),
    };
  });
  console.log(postFilteredIngredients);
  return postFilteredIngredients;
}
