import AddDensityPopup from "./AddWeightModal.jsx";

export function ImportSelector(props) {
  const ingredientChoices = props.ingredients;
  const origIdx = props.origIdx;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const ingredient = updatedRecipe.ingredients[origIdx];

  // function setDensity(grams, description) {
  //   setUpdatedRecipe({
  //     ...updatedRecipe,
  //     ingredients: updatedRecipe.ingredients.map((ingredient) => {
  //       if (ingredient.id === origIdx) {
  //         return {
  //           ...ingredient,
  //           userGrams: 1 / grams,
  //           userMeasure: description,
  //           gramConversion: 1 / grams,
  //         };
  //       } else {
  //         return { ...ingredient };
  //       }
  //     }),
  //   });
  // }

  return (
    <div>
      <input
        required
        key={`input${origIdx}`}
        id={ingredient.description}
        type="number"
        min="0"
        step=".01"
        className="form-check-label"
        htmlFor={ingredient.id}
        style={{ width: "5rem" }}
        name={ingredient.description}
        value={updatedRecipe.ingredients[origIdx]?.quantity}
        onChange={(e) => {
          setUpdatedRecipe({
            ...updatedRecipe,
            ingredients: updatedRecipe.ingredients.map((i) => {
              if (i.id === ingredient.id) {
                return {
                  ...i,
                  quantity: parseFloat(e.target.value),
                };
              } else {
                return { ...i };
              }
            }),
          });
        }}
      />

      <select
        value={ingredient.id}
        key={`selector${origIdx}`}
        onChange={(e) =>
          setUpdatedRecipe({
            ...updatedRecipe,
            ingredients: updatedRecipe.ingredients.map((ingredient, idx) => {
              if (idx === origIdx) {
                return ingredientChoices.find(
                  (choice) => choice.id == e.target.value
                );
              } else {
                return { ...ingredient };
              }
            }),
          })
        }
        style={{
          width: "60%",
        }}
      >
        {ingredientChoices.map((choice, idx) => (
          <>
            <option
              value={choice.id}
              index={idx}
              key={`${origIdx}${idx}`}
              id={idx}
              style={{ color: choice.gramConversion ? "green" : "black" }}
            >
              {`${
                ingredient.userLabel
                  ? ingredient.userLabel
                  : choice.matchedMeasure
                  ? choice.matchedMeasure
                  : choice.unitOfMeasure
                  ? choice.unitOfMeasure
                  : ""
              } ${choice.description} ${
                updatedRecipe.ingredients[origIdx].userG
                  ? `(${
                      ingredient.quantity /
                      updatedRecipe.ingredients[origIdx].userG
                    }g)`
                  : choice.gramConversion
                  ? `${choice.fdc_id} (${parseInt(
                      ingredient.quantity / choice.gramConversion
                    )}g )`
                  : ""
              }`}
            </option>
          </>
        ))}
      </select>
      {
        <AddDensityPopup
          ingredient={ingredient}
          updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
          color={ingredient.gramConversion ? "black" : "red"}
        />
      }
    </div>
  );
}
