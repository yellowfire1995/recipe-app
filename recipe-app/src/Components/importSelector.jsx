import { useEffect, useState } from "react";
import AddDensityPopup from "./AddWeightModal.jsx";

export function ImportSelector(props) {
  const ingredientChoices = props.ingredients;
  const origIdx = props.origIdx;

  const [ingredient, setIngredient] = useState(ingredientChoices[0]);

  useEffect(() => props.handleCallback(ingredient), [ingredient]);

  function setDensity(grams, description) {
    setIngredient({
      ...ingredient,
      userGrams: 1 / grams,
      userMeasure: description,
      gramConversion: 1 / grams,
    });
  }

  return (
    <div key={origIdx}>
      <input
        required
        key={origIdx}
        id={ingredient.description}
        type="number"
        min="0"
        step=".01"
        className="form-check-label"
        htmlFor={ingredient.id}
        style={{ width: "5rem" }}
        name={ingredient.description}
        value={ingredient.quantity}
        onChange={(e) =>
          setIngredient({ ...ingredient, quantity: parseFloat(e.target.value) })
        }
      />

      <select
        onChange={(e) => setIngredient(ingredientChoices[e.target.value])}
        style={{ width: "60%" }}
      >
        {ingredientChoices.map((choice, idx) => (
          <>
            <option
              value={idx}
              key={choice.id}
              id={idx}
              style={{ color: choice.gramConversion ? "green" : "black" }}
            >
              {`${
                choice.matchedMeasure
                  ? choice.matchedMeasure
                  : choice.unitOfMeasure
                  ? choice.unitOfMeasure
                  : ""
              } ${choice.description} ${
                choice.gramConversion
                  ? `${choice.fdc_id} (${parseInt(
                      ingredient.quantity / choice.gramConversion
                    )}g )`
                  : ""
              }`}
            </option>
          </>
        ))}
      </select>
      {<AddDensityPopup ingredient={ingredient} callback={setDensity} />}
    </div>
  );
}
