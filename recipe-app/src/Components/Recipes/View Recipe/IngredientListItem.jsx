import { useAuth0 } from "@auth0/auth0-react";
import AddPriceModal from "../Multipurpose/AddPriceModal";

export function IngredientListItem({ ingredient, handleCheck, checkedArray }) {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="form-check d-flex" key={ingredient.id}>
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
        <div className="d-inline fw-semibold">
          {ingredient.userG
            ? Math.round(ingredient.userG * ingredient.quantity * 100) / 100 +
              " " +
              ingredient.userLabel
            : ingredient.gramConversion
            ? `${
                Math.round(
                  ingredient.gramConversion * ingredient.quantity * 100
                ) /
                  100 +
                " " +
                ingredient.engLabel
              }`
            : `${Math.round(ingredient.quantity)} g`}
        </div>
        {ingredient.gramConversion || ingredient.userG
          ? ` (${Math.round(ingredient.quantity)} g)`
          : ""}
        {` ${ingredient.description}`}
        {`${
          ingredient.price
            ? ` - $${(
                Math.round(ingredient.price * ingredient.quantity * 100) / 100
              ).toFixed(2)}`
            : ""
        }`}
        {isAuthenticated && <AddPriceModal ingredient={ingredient} />}
      </label>
    </div>
  );
}
