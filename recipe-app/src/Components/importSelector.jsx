import { useEffect, useState } from "react";

export function ImportSelector(props) {
  const ingredientChoices = props.ingredients;
  const origIdx = props.origIdx;

  const [ingredient, setIngredient] = useState(ingredientChoices[0]);

  useEffect(() => props.handleCallback(ingredient), [ingredient]);

  return (
    <div key={origIdx}>
      <input
        required
        key={origIdx}
        id={ingredient.description}
        type="number"
        min="0"
        step=".1"
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
              {`${choice.matchedMeasure} ${choice.description} ${
                choice.gramConversion
                  ? `(${parseInt(
                      ingredient.quantity / choice.gramConversion
                    )}g )`
                  : ""
              }`}
            </option>
          </>
        ))}
      </select>
    </div>
  );
}
