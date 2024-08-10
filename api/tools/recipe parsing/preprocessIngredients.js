import { parseIngredient } from "parse-ingredient";

export default function preprocessIngredients(ingredients) {
  //trim list item notations
  const filteredIngredients = ingredients.replace(
    /^[• ?]|^[▢ ?]|(?<=^\d*\.\d{2})\d*/gm,
    ""
  );

  const addPrecedingZero = filteredIngredients.replace(
    /(?<!\d)\.(?=\d+)/gm,
    "0."
  );

  const matchedIngredientList = parseIngredient(addPrecedingZero);

  const postFilteredIngredients = matchedIngredientList.map((ingredient) => {
    return {
      ...ingredient,
      description: ingredient.description.replace(
        / ?\(.*\)|,(?=[^,]*$)(.*)|\d+/gim,
        ""
      ), //replaces anything within parenthesis or the last comma group of the ingredient
      comment: ingredient.description.match(/ ?\(.*\)|,(?=[^,]*$)(.*)/gi),
    };
  });
  return postFilteredIngredients;
}
