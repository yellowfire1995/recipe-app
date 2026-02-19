import { useState } from "react";
import Button from "react-bootstrap/esm/Button.js";

export function EditSelector(props) {
  const [ingredientChoices] = props.ingredients;
  const origIdx = props.origIdx;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [ingredient, setIngredient] = useState(ingredientChoices[0][0]);

  function handleSubmit(e) {
    e.preventDefault;
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        required
        key={`input${origIdx}`}
        type="number"
        min="0"
        step=".1"
        className="form-check-label"
        style={{ width: "5rem" }}
        value={
          ingredient.userG
            ? ingredient.userG * ingredient.quantity
            : ingredient.gramConversion
              ? Math.round(
                  ingredient.quantity * ingredient.gramConversion * 100,
                ) / 100
              : ingredient.quantity
        }
        onChange={(e) =>
          setIngredient({
            ...ingredient,
            quantity:
              Math.round(
                (e.target.valueAsNumber /
                  (ingredient.userG || ingredient.gramConversion)) *
                  100,
              ) / 100,
          })
        }
      />

      <select
        key={`selector${origIdx}`}
        id={origIdx}
        onChange={(e) => setIngredient(JSON.parse(e.target.value))}
        style={{
          width: "60%",
        }}
      >
        {ingredientChoices[0].map((choice, idx) => (
          <option
            value={JSON.stringify(choice)}
            data-index={idx}
            key={`${origIdx}${idx}`}
            id={origIdx}
            style={{ color: choice.gramConversion ? "green" : "black" }}
          >
            {`${
              choice.userLabel
                ? choice.userLabel
                : choice.matchedMeasure
                  ? choice.matchedMeasure
                  : choice.unitOfMeasure
                    ? choice.unitOfMeasure
                    : ""
            } ${choice.description} (${choice.category}) ${
              choice.userG
                ? `(${ingredient.quantity}g)`
                : choice.gramConversion
                  ? `${choice.fdc_id} (${parseInt(ingredient.quantity)}g )`
                  : ""
            }`}
          </option>
        ))}
      </select>

      <Button
        type="submit"
        htmlFor={origIdx}
        onClick={(e) => {
          e.preventDefault();
          setUpdatedRecipe({
            ...updatedRecipe,
            ingredients: [...updatedRecipe.ingredients, ingredient],
          });
        }}
      >
        Add
      </Button>
    </form>
  );
}
