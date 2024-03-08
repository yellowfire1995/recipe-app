export function NutritionFacts(props) {
  const nutrition = props.nutrition;
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
              {nutrition.kcal}
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
              {` ${nutrition.tot_fat}g`}
            </th>
            <td>
              <b>{`${Math.round(nutrition.tot_fat / 0.65)}%`}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>Saturated Fat {` ${nutrition.sat_fat}g`}</th>
            <td>
              <b>{` ${Math.round(nutrition.sat_fat / 0.2)}%`}</b>
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
              {` ${nutrition.chol}mg`}
            </th>
            <td>
              <b>{` ${Math.round(nutrition.chol / 3)}%`}</b>
            </td>
          </tr>
          <tr>
            <th colSpan={2}>
              <b>Sodium</b>
              {` ${nutrition.sodium}mg`}
            </th>
            <td>
              <b>{` ${Math.round(nutrition.sodium / 24)}%`}</b>
            </td>
          </tr>
          <tr>
            <th colSpan={2}>
              <b>Total Carbohydrate</b>
              {` ${nutrition.carb}g`}
            </th>
            <td>
              <b>{` ${Math.round(nutrition.carb / 3)}%`}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>Dietary Fiber {` ${nutrition.fiber}g`}</th>
            <td>
              <b>{` ${nutrition.fiber / 0.25}%`}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>Sugars {` ${nutrition.sugar}g`}</th>
            <td></td>
          </tr>
          <tr className="thick-end">
            <th colSpan={2}>
              <b>Protein</b>
              {` ${nutrition.protein}g`}
            </th>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table className="performance-facts__table--grid">
        <tbody>
          <tr>
            <td colSpan={2}>
              Vitamin D {` ${Math.round(nutrition.vit_d / 0.15)}%`}
            </td>
            <td>Vitamin C {` ${Math.round(nutrition.vit_c / 0.85)}%`}</td>
          </tr>
          <tr className="thin-end">
            <td colSpan={2}>
              Calcium {` ${Math.round(nutrition.calcium / 10)}%`}
            </td>
            <td>Iron {` ${Math.round(nutrition.iron / 0.1)}%`}</td>
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
    </>
  );
}
