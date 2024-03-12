import { numericQuantity } from "numeric-quantity";

const foodMeasurements = [
  {
    measurement: /^t(ea)?sp(oon)?s?/i,
    conversionFactor: 0.0208333,
    type: "volume",
  }, // 1 teaspoon = 5 grams
  {
    measurement: /^ta?b(le)?sp(oon)?s?/i,
    conversionFactor: 0.0625,
    type: "volume",
  }, // 1 tablespoon = 15 grams
  { measurement: /^c(up)?s?/i, conversionFactor: 1, type: "volume" }, // 1 cup = 240 grams
  { measurement: /^o(unce)?z?s?/i, conversionFactor: 28.3495, type: "weight" }, // 1 ounce = 28.3495 grams
  {
    measurement: /^pounds?/i,
    conversionFactor: 453.592,
    type: "weight",
  }, // 1 pound = 453.592 grams
  { measurement: /^g(ram)?s?/i, conversionFactor: 1, type: "weight" }, // 1 gram = 1 gram (just for completeness)
  {
    measurement: /^m(illi)?g(ram)?s?/i,
    conversionFactor: 0.001,
    type: "weight",
  }, // 1 milligram = 0.001 grams
  { measurement: /^k(ilo)?g(ram)?s?/i, conversionFactor: 1000, type: "weight" }, // 1 kilogram = 1000 grams
  // Add more measurements as needed
  {
    measurement: /^lbs?/i,
    conversionFactor: 453.592,
    type: "weight",
  }, // 1 pound = 453.592 grams
  {
    measurement: /^g(ram)?s?/i,
    conversionFactor: 1,
    type: "weight",
  }, // 1 pound = 453.592 grams
];

//Select most common ingredient measures
const foodMeasurementRegex =
  /(cup(s)?|teaspoon(s)?|tablespoon(s)?|fluid ounce(s)?|pint(s)?|quart(s)?|gallon(s)?|ounce(s)?|pound(s)?|gram(s)?|kilogram(s)?|milliliter(s)?|liter(s)?|dash(es)?|pinch(es)?|slice(s)?|piece(s)?|package(s)?|can(s)?|bottle(s)?|jar(s)?|scoop(s)?|handful(s)?|bunch(es)?|stalk(s)?|sprig(s)?|head(s)?|bulb(s)?|clove(s)?)/gi;

export default function parseIngredients(ingredients) {
  const ingredientArray = [];

  //Split ingredient list into lines based on new line break
  const ingredientLines = ingredients
    .split("\n")
    .filter((ingredient) => ingredient.match(/^[^a-zA-Z ]/));

  //Find ingredient quantity by looking at characters/vulgar fractions until hit a word or parenthesis
  const ingredientAmt = ingredientLines.map((ingredient) =>
    numericQuantity(
      ingredient.match(
        "[\u00BC-\u00BE\u2150-\u215E\\d]+(?:(?:/| |.)[\u00BC-\u00BE\u2150-\u215E\\d])?"
      )
    )
  );

  //Ingredient amount string used to remove from final ingredient name for search
  const ingredientAmtString = ingredientLines.map((ingredient) =>
    ingredient.match(
      "[\u00BC-\u00BE\u2150-\u215E\\d]+(?:(?:/| |.)[\u00BC-\u00BE\u2150-\u215E\\d])?"
    )
  );

  //Search for anything after comma
  const ingredientComment = ingredientLines.map((ingredient) =>
    ingredient.match(", (.*(?=$))") ? ingredient.match(", (.*(?=$))")[1] : null
  );

  //Looks for word right after digits and before parentehsis if present
  const ingredientMeasure = ingredientLines.map((ingredient) =>
    ingredient.match("\\w+(?= \\()|(?<=\\) )\\w+")
      ? ingredient.match("\\w+(?= \\()|(?<=\\) )\\w+")
      : ingredient.match("(?<=[\\d\u00BC-\u00BE\u2150-\u215E] )\\w+")
  );

  //Look for anything within parenthesis
  const ingredientSecondary = ingredientLines.map((ingredient) =>
    ingredient.match(".(?<=\\(.*).*(?=.*\\)).")
      ? ingredient.match(".(?<=\\(.*).*(?=.*\\)).")
      : {}
  );

  const conversionFactors = ingredientMeasure.map((measurement) =>
    foodMeasurements.find((foodMeasurement) =>
      foodMeasurement.measurement.test(measurement)
    )
      ? foodMeasurements.find((foodMeasurement) =>
          foodMeasurement.measurement.test(measurement)
        )
      : { measurement: null }
  );

  //Remaining ingredient name is any word(s) remaining
  const ingredientName = ingredientLines.map((ingredient, idx) => {
    try {
      console.log(
        ingredient
          // .replace(ingredientComment[idx], "")
          // .replace(ingredientMeasure[idx], "")
          .replace(ingredientAmtString[idx], "")
          .replace(ingredientSecondary[idx], "")
          .replace(foodMeasurementRegex, "")
          .match(/\w+/g)
          .join(" ")
      );
      return (
        ingredient
          // .replace(ingredientComment[idx], "")
          // .replace(ingredientMeasure[idx], "")
          .replace(ingredientAmtString[idx], "")
          .replace(ingredientSecondary[idx], "")
          .replace(foodMeasurementRegex, "")
          .match(/\w+/g)
          .join(" ")
      );
    } catch (error) {
      return ingredientMeasure[idx];
    }
  });

  //Create ingredient array by taking each element.
  for (let i = 0; i < ingredientLines.length; i++) {
    const ingredientList = {
      id: i,
      origAmt: ingredientAmt[i],
      measure: ingredientMeasure[i],
      ingredient: ingredientName[i],
      comment: ingredientComment[i],
      measurement: conversionFactors[i].measurement,
      amt:
        conversionFactors[i].type === "weight"
          ? conversionFactors[i].conversionFactor * ingredientAmt[i]
          : null,
      conversionFactor: conversionFactors[i].conversionFactor,
    };
    ingredientArray.push(ingredientList);
  }

  return ingredientArray;
}
