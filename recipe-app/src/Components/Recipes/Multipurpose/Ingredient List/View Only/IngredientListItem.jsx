import { useAuth0 } from "@auth0/auth0-react";
import _ from "lodash";
import AddPriceModal from "../../AddPriceModal";

export function IngredientListItem({ ingredient, handleCheck, checkedArray }) {
  const { isAuthenticated } = useAuth0();

  const ingredientWeightLabel =
    ingredient.quantity > 0
      ? ingredient.userLabel ||
        ingredient.engLabel ||
        ingredient.matchedMeasure ||
        ""
      : "";

  const ingredientDescription =
    (ingredient.quantity > 0 && !ingredient.displayOriginalName) ||
    !ingredient.userIngredientName
      ? ingredient.description
      : ingredient.userIngredientName;

  const ingredientQuantity =
    ingredient.quantity > 0
      ? _.round(
          ingredient.quantity *
            (ingredient.userG || ingredient.gramConversion || 1),
          2
        )
      : "";

  const ingredientPrice =
    ingredient.quantity > 0
      ? ingredient.price
        ? `- $${_.round(ingredient.price * ingredient.quantity, 2)}`
        : ""
      : "";

  const ingredientQuantityGrams =
    ingredient.quantity > 0
      ? ingredient.userG || ingredient.gramConversion
        ? `(${_.round(ingredient.quantity)}g) `
        : ""
      : "";

  return (
    <div className="form-check d-flex py-2" key={ingredient.id}>
      <input
        className="form-check-input me-1"
        type="checkbox"
        id={ingredient.id}
        onClick={() => handleCheck(ingredient.id)}
      />
      <label
        className={`form-check-label text-lowercase ${
          checkedArray.includes(ingredient.id)
            ? "text-decoration-line-through"
            : ""
        }`}
        htmlFor={ingredient.id}
      >
        <div className="d-inline fw-semibold">
          {ingredientQuantity} {ingredientWeightLabel} {ingredientQuantityGrams}
        </div>
        {ingredientDescription}
        {ingredient.quantity <= 0 || !ingredient.nutrients ? "*" : ""}{" "}
        {ingredientPrice}
      </label>
      {isAuthenticated && <AddPriceModal ingredient={ingredient} />}
    </div>
  );
}
