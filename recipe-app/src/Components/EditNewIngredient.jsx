import Button from "react-bootstrap/esm/Button.js";
import AddWeightModal from "./AddWeightModal.jsx";
import { useState } from "react";

export function EditSelector(props) {
  const [ingredientChoices, setIngredientChoices] = props.ingredients;
  const origIdx = props.origIdx;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [amount, setAmount] = useState(ingredientChoices[0][0].quantity);
  const [ingredient, setIngredient] = useState(ingredientChoices[0][0]);

  function handleSubmit(e) {
    e.preventDefault;
    console.log(e.target);
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
                ingredient.quantity * ingredient.gramConversion * 100
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
                  100
              ) / 100,
          })
        }
        // id={ingredient.description}
        // htmlFor={ingredient.id}
        // name={ingredient.description}
        // value={updatedRecipe.ingredients[origIdx]?.quantity}
        // onChange={(e) => {
        //   setUpdatedRecipe({
        //     ...updatedRecipe,
        //     ingredients: updatedRecipe.ingredients.map((i) => {
        //       if (i.id === ingredient.id) {
        //         return {
        //           ...i,
        //           quantity: parseFloat(e.target.value),
        //         };
        //       } else {
        //         return { ...i };
        //       }
        //     }),
        //   });
        // }}
      />

      <select
        // value={ingredient.id}
        key={`selector${origIdx}`}
        id={origIdx}
        onChange={(e) => setIngredient(JSON.parse(e.target.value))}
        // onChange={(e) =>
        //   setUpdatedRecipe({
        //     ...updatedRecipe,
        //     ingredients: updatedRecipe.ingredients.map((ingredient, idx) => {
        //       if (idx === origIdx) {
        //         return ingredientChoices.find(
        //           (choice) => choice.id == e.target.value
        //         );
        //       } else {
        //         return { ...ingredient };
        //       }
        //     }),
        //   })
        // }
        style={{
          width: "60%",
        }}
      >
        {ingredientChoices[0].map((choice, idx) => (
          <>
            <option
              value={JSON.stringify(choice)}
              index={idx}
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
          </>
        ))}
      </select>

      {/* <AddDensityPopup
        ingredient={ingredient}
        updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
        color={ingredient.gramConversion ? "black" : "red"}
      /> */}
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
