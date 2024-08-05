import { useAuth0 } from "@auth0/auth0-react";
import AddPriceModal from "../../AddPriceModal";
import _ from "lodash";

export function IngredientListItem({ ingredient, handleCheck, checkedArray }) {
  const { isAuthenticated } = useAuth0();

  const ingredientQuantity = _.round(
    ingredient.quantity * (ingredient.userG || ingredient.gramConversion || 1),
    2
  );
  const ingredientLabel = ingredient.userLabel || ingredient.engLabel || "g";

  return (
    <div className="form-check d-flex py-2" key={ingredient.id}>
      <input
        className="form-check-input"
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
        <div className="d-inline fw-semibold pe-1">
          {ingredientQuantity} {ingredientLabel}
        </div>
        {ingredient.description}
      </label>
      {isAuthenticated && <AddPriceModal ingredient={ingredient} />}
    </div>
  );
}
