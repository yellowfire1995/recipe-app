import { NutritionFactsHeader } from "./NutritionFactsHeader";

export function NutritionFacts(props) {
  const recipe = props.recipe;

  const totalFat = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1004] ? (nutrient[1004] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );

  const vitaminD = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1110] ? (nutrient[1110] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const protein = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1003] ? (nutrient[1003] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const carbs = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1005] ? (nutrient[1005] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const calories = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1008] ? (nutrient[1008] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const fiber = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1079] ? (nutrient[1079] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const calcium = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1087] ? (nutrient[1087] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const iron = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1089] ? (nutrient[1089] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const sodium = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1093] ? (nutrient[1093] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const vitaminC = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1162] ? (nutrient[1162] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const cholesterol = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1253] ? (nutrient[1253] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const saturatedFat = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[1258] ? (nutrient[1258] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );
  const sugar = Math.round(
    recipe.ingredients.reduce((total, ingredient) => {
      return (
        total +
        ingredient.nutrients.reduce((sum, nutrient) => {
          return (
            sum +
            (nutrient[2000] ? (nutrient[2000] / 100) * ingredient.quantity : 0)
          );
        }, 0)
      );
    }, 0) / recipe.servings
  );

  return (
    <>
      <section className="performance-facts">
        {props.header ? (
          <NutritionFactsHeader recipe={recipe} servings={props.servings} />
        ) : (
          ""
        )}

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
                {calories}
              </th>
              <td></td>
            </tr>
            <tr className="thick-row">
              <td colSpan={3} className="small-info">
                <b>% Daily Value*</b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <b>Total Fat</b>
                {` ${totalFat}g`}
              </th>
              <td>
                <b>{`${Math.round(totalFat / 0.65)}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell"></td>
              <th>Saturated Fat {` ${saturatedFat}g`}</th>
              <td>
                <b>{` ${Math.round(saturatedFat / 0.2)}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell"></td>
              <th>Trans Fat 0g</th>
              <td></td>
            </tr>
            <tr>
              <th colSpan={2}>
                <b>Cholesterol</b>
                {` ${cholesterol}mg`}
              </th>
              <td>
                <b>{` ${Math.round(cholesterol / 3)}%`}</b>
              </td>
            </tr>

            <tr>
              <th colSpan={2}>
                <b>Sodium</b>
                {` ${sodium}mg`}
              </th>
              <td>
                <b>{` ${Math.round(sodium / 24)}%`}</b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <b>Total Carbohydrate</b>
                {` ${carbs}g`}
              </th>
              <td>
                <b>{` ${Math.round(carbs / 3)}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell"></td>
              <th>Dietary Fiber {` ${fiber}g`}</th>
              <td>
                <b>{` ${fiber / 0.25}%`}</b>
              </td>
            </tr>
            <tr>
              <td className="blank-cell"></td>
              <th>Sugars {` ${sugar}g`}</th>
              <td></td>
            </tr>
            <tr className="thick-end">
              <th colSpan={2}>
                <b>Protein</b>
                {` ${protein}g`}
              </th>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className="performance-facts__table--grid">
          <tbody>
            <tr>
              <td colSpan={2}>
                Vitamin D {` ${Math.round(vitaminD / 0.15)}%`}
              </td>
              <td>Vitamin C {` ${Math.round(vitaminC / 0.85)}%`}</td>
            </tr>
            <tr className="thin-end">
              <td colSpan={2}>Calcium {` ${Math.round(calcium / 10)}%`}</td>
              <td>Iron {` ${Math.round(iron / 0.1)}%`}</td>
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
          Fat 9 • Carbohydrate 4 • Protein 4
        </p>
      </section>
    </>
  );
}
