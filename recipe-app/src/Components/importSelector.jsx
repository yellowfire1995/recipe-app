import { useEffect, useState } from "react";

export function ImportSelector(props) {
  const ingredientChoices = props.ingredients;
  const origIdx = props.origIdx;

  const [ingredient, setIngredient] = useState(ingredientChoices[0]);

  useEffect(() => props.handleCallback(ingredient), [ingredient]);

  return (
    <div key={origIdx}>
      <input
        id={ingredient.ingredient}
        type="number"
        min="0"
        step=".1"
        className="form-check-label"
        htmlFor={ingredient.ingredient}
        style={{ width: "5rem" }}
        name={ingredient.ingredient}
        value={ingredient.amt}
        onChange={(e) =>
          setIngredient({ ...ingredient, amt: parseInt(e.target.value) })
        }
      />
      g
      <select
        onChange={(e) => setIngredient(ingredientChoices[e.target.value])}
        style={{ width: "60%" }}
      >
        {ingredientChoices.map((ingredient, idx) => (
          <>
            <option
              value={idx}
              key={ingredient.fdc_id}
              style={{ color: ingredient.amt > 0 ? "green" : "black" }}
            >
              {`${ingredient.ingredient} ${
                ingredient.altLabel ? `(${ingredient.altLabel})` : ""
              }`}
            </option>
          </>
        ))}
      </select>
    </div>
  );
}
