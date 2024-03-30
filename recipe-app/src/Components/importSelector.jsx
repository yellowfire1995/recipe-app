import AddDensityPopup from "./AddWeightModal.jsx";
import Form from "react-bootstrap/Form";

export function ImportSelector(props) {
  const ingredientChoices = props.ingredients;
  const origIdx = props.origIdx;
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const ingredient = updatedRecipe.ingredients[origIdx];

  return (
    <div className="d-inline-flex align-items-center">
      <Form.Control
        required
        key={`input${origIdx}`}
        id={ingredient.description}
        type="number"
        min="0"
        step=".01"
        className="form-check-label py-1 pe-2"
        htmlFor={ingredient.id}
        style={{ width: "5rem" }}
        name={ingredient.description}
        value={
          ingredient.userG
            ? Math.round(ingredient.userG * ingredient.quantity * 100) / 100
            : ingredient.gramConversion
            ? Math.round(
                ingredient.quantity * ingredient.gramConversion * 100
              ) / 100
            : ingredient.quantity
        }
        onChange={(e) => {
          setUpdatedRecipe({
            ...updatedRecipe,
            ingredients: updatedRecipe.ingredients.map((i) => {
              if (i.id === ingredient.id) {
                return {
                  ...i,
                  quantity:
                    e.target.valueAsNumber /
                    (ingredient.userG || ingredient.gramConversion),
                };
              } else {
                return { ...i };
              }
            }),
          });
        }}
      />

      <Form.Select
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
        className="py-1"
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
                choice.userG || choice.gramConversion
                  ? Math.round(
                      ((ingredient.quantity * ingredient.gramConversion) /
                        (choice.userG || choice.gramConversion)) *
                        100
                    ) /
                      100 +
                    "g"
                  : "(No density information)"
              }`}
            </option>
          </>
        ))}
      </Form.Select>
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
