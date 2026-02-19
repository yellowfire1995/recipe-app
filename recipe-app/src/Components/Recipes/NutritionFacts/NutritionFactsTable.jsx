import logger from "../../../utils/logger";
import { useRecipeContext } from "../RecipeContextProvider";
import { useNutritionFactsContext } from "./NutritionFactsContext";

const nutrientsPerServing = {
  totalFat: 0,
  vitaminD: 0,
  protein: 0,
  carbs: 0,
  calories: 0,
  fiber: 0,
  calcium: 0,
  iron: 0,
  sodium: 0,
  vitaminC: 0,
  cholesterol: 0,
  saturatedFat: 0,
  sugar: 0,
};

const nutrientLookup = {
  totalFat: 1004,
  vitaminD: 1110,
  protein: 1003,
  carbs: 1005,
  calories: 1008,
  fiber: 1079,
  calcium: 1087,
  iron: 1089,
  sodium: 1093,
  vitaminC: 1162,
  cholesterol: 1253,
  saturatedFat: 1258,
  sugar: 2000,
};

function calculateNutrient({ nutrientName, headersRemovedArray, servings }) {
  const nutrientId = nutrientLookup[nutrientName];
  try {
    return Math.round(
      headersRemovedArray.reduce((total, ingredient) => {
        return (
          total +
          ingredient.nutrients.reduce((sum, nutrient) => {
            return (
              sum +
              (nutrient[nutrientId]
                ? (nutrient[nutrientId] / 100) * ingredient.quantity
                : 0)
            );
          }, 0)
        );
      }, 0) / servings,
    );
  } catch (error) {
    logger.log(error);
    return 0;
  }
}

export function NutritionFactsTable() {
  const { recipe } = useRecipeContext();
  const { ingredientArray = recipe.ingredients, servings = recipe.servings } =
    useNutritionFactsContext();
  try {
    const headersRemovedArray = ingredientArray
      .map((ingredient) => {
        if (!ingredient.isGroupHeader) {
          return ingredient;
        }
      })
      .filter((ingredient) => ingredient !== undefined)
      .filter((ingredient) => ingredient.nutrients);

    Object.keys(nutrientsPerServing).forEach((nutrientName) => {
      nutrientsPerServing[nutrientName] = calculateNutrient({
        nutrientName,
        headersRemovedArray,
        servings,
      });
    });

    return (
      <>
        <table className="performance-facts__table">
          <thead>
            <tr>
              <th colSpan={3} className="small-info">
                Amount Per Serving
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>
                <b>Calories</b>
                {nutrientsPerServing.calories}
              </th>
              <td />
            </tr>
            <tr className="thick-row">
              <td colSpan={3} className="small-info">
                <b>% Daily Value*</b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <b>Total Fat</b>
                {` ${nutrientsPerServing.totalFat}g`}
              </th>
              <td>
                <b>{`${Math.round(nutrientsPerServing.totalFat / 0.65)}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell" />
              <th>Saturated Fat {` ${nutrientsPerServing.saturatedFat}g`}</th>
              <td>
                <b>{` ${Math.round(
                  nutrientsPerServing.saturatedFat / 0.2,
                )}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell" />
              <th>Trans Fat 0g</th>
              <td />
            </tr>
            <tr>
              <th colSpan={2}>
                <b>Cholesterol</b>
                {` ${nutrientsPerServing.cholesterol}mg`}
              </th>
              <td>
                <b>{` ${Math.round(nutrientsPerServing.cholesterol / 3)}%`}</b>
              </td>
            </tr>

            <tr>
              <th colSpan={2}>
                <b>Sodium</b>
                {` ${nutrientsPerServing.sodium}mg`}
              </th>
              <td>
                <b>{` ${Math.round(nutrientsPerServing.sodium / 24)}%`}</b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <b>Total Carbohydrate</b>
                {` ${nutrientsPerServing.carbs}g`}
              </th>
              <td>
                <b>{` ${Math.round(nutrientsPerServing.carbs / 3)}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell" />
              <th>Dietary Fiber {` ${nutrientsPerServing.fiber}g`}</th>
              <td>
                <b>{` ${nutrientsPerServing.fiber / 0.25}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell" />
              <th>Sugars {` ${nutrientsPerServing.sugar}g`}</th>
              <td />
            </tr>
            <tr className="thick-end">
              <th colSpan={2}>
                <b>Protein</b>
                {` ${nutrientsPerServing.protein}g`}
              </th>
              <td />
            </tr>
          </tbody>
        </table>
        <table className="performance-facts__table--grid">
          <tbody>
            <tr>
              <td colSpan={2}>
                Vitamin D{" "}
                {` ${Math.round(nutrientsPerServing.vitaminD / 0.15)}%`}
              </td>
              <td>
                Vitamin C{" "}
                {` ${Math.round(nutrientsPerServing.vitaminC / 0.85)}%`}
              </td>
            </tr>
            <tr className="thin-end">
              <td colSpan={2}>
                Calcium {` ${Math.round(nutrientsPerServing.calcium / 10)}%`}
              </td>
              <td>Iron {` ${Math.round(nutrientsPerServing.iron / 0.1)}%`}</td>
            </tr>
          </tbody>
        </table>
        <p className="small-info">
          * Percent Daily Values are based on a 2,000 calorie diet. Your daily
          values may be higher or lower depending on your calorie needs:
        </p>
        <table className="performance-facts__table--small small-info">
          <thead>
            <tr>
              <td colSpan={2} />
              <th>Calories:</th>
              <th>2,000</th>
              <th>2,500</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>Total Fat</th>
              <td>Less than</td>
              <td>65g</td>
              <td>80g</td>
            </tr>
            <tr>
              <td className="blank-cell" />
              <th>Saturated Fat</th>
              <td>Less than</td>
              <td>20g</td>
              <td>25g</td>
            </tr>
            <tr>
              <th colSpan={2}>Cholesterol</th>
              <td>Less than</td>
              <td>300mg</td>
              <td>300 mg</td>
            </tr>
            <tr>
              <th colSpan={2}>Sodium</th>
              <td>Less than</td>
              <td>2,400mg</td>
              <td>2,400mg</td>
            </tr>
            <tr>
              <th colSpan={3}>Total Carbohydrate</th>
              <td>300g</td>
              <td>375g</td>
            </tr>
            <tr>
              <td className="blank-cell" />
              <th colSpan={2}>Dietary Fiber</th>
              <td>25g</td>
              <td>30g</td>
            </tr>
          </tbody>
        </table>
        <p className="small-info">Calories per gram:</p>
        <p className="small-info text-center">
          Fat 9 • Carbohydrate 4 • Protein 4<br />
          *Indicates no nutritional informaton for that ingredient
        </p>
      </>
    );
  } catch (error) {
    logger.log(error);
    return <div>Error loading nutrition.</div>;
  }
}
