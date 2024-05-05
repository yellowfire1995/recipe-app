import EditIngredientModal from "./EditIngredientModal.jsx";
import Form from "react-bootstrap/Form";

export function ImportSelector(props) {
  const ingredientList = props.ingredientList;
  const origIdx = props.origIdx;
  const [ingredient, setIngredient] = props.ingredient;

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
          setIngredient({
            ...ingredient,
            quantity:
              e.target.valueAsNumber /
              (ingredient.userG || ingredient.gramConversion),
          });
        }}
      />

      <Form.Select
        value={ingredient.id}
        key={`selector${origIdx}`}
        onChange={(e) =>
          setIngredient(
            ingredientList.find((choice) => choice.id == e.target.value)
          )
        }
        className="py-1"
      >
        {ingredientList.map((choice, idx) => {
          return (
            <option
              value={choice.id}
              index={idx}
              key={`${origIdx}${idx}`}
              id={idx}
              style={{
                color: choice.gramConversion ? "green" : "black",
              }}
            >
              {`${
                ingredient.userLabel
                  ? ingredient.userLabel
                  : choice.matchedMeasure
                  ? choice.matchedMeasure
                  : choice.unitOfMeasure
                  ? choice.unitOfMeasure
                  : ""
              } ${
                choice.id == ingredient.id
                  ? ingredient.description
                  : choice.description
              } ${
                choice.userG || choice.gramConversion
                  ? Math.round(
                      ((ingredient.quantity * ingredient.gramConversion ||
                        ingredient.userG ||
                        1) /
                        (choice.userG || choice.gramConversion)) *
                        100
                    ) /
                      100 +
                    "g"
                  : "(No density information)"
              }`}
            </option>
          );
        })}
      </Form.Select>
    </div>
  );
}
