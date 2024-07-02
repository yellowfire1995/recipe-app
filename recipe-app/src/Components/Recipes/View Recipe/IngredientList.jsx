import { useState } from "react";
import { useRecipeContext } from "../RecipeContextProvider";
import ListGroup from "react-bootstrap/ListGroup";
import AddPriceModal from "../Multipurpose/AddPriceModal";

export function IngredientList() {
  const { recipe } = useRecipeContext();

  const [checkedArray, setCheckedArray] = useState([]);

  function handleCheck(ingredientId) {
    !checkedArray.includes(ingredientId)
      ? setCheckedArray([...checkedArray, ingredientId])
      : setCheckedArray(
          checkedArray.filter((idInclude) => idInclude !== ingredientId)
        );
  }

  return (
    <ListGroup>
      <span className="h3">
        Ingredients <br />
      </span>
      {recipe?.ingredients.map((ingredient) => {
        if (ingredient.isGroupHeader) {
          return (
            <h4 key={ingredient.id}>{ingredient.description.toUpperCase()}</h4>
          );
        }
        return (
          <div className="form-check" key={ingredient.id}>
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
                  ? Math.round(
                      ingredient.userG *
                        ingredient.quantity *
                        recipe.servings *
                        100
                    ) /
                      100 +
                    " " +
                    ingredient.userLabel
                  : ingredient.gramConversion
                  ? `${
                      Math.round(
                        ingredient.gramConversion *
                          ingredient.quantity *
                          recipe.servings *
                          100
                      ) /
                        100 +
                      " " +
                      ingredient.engLabel
                    }`
                  : `${Math.round(ingredient.quantity * recipe.servings)} g`}
              </div>
              {ingredient.gramConversion || ingredient.userG
                ? ` (${Math.round(ingredient.quantity * recipe.servings)} g)`
                : ""}
              {` ${ingredient.description}`}{" "}
              {`- $${(
                Math.round(
                  ingredient.price * ingredient.quantity * recipe.servings * 100
                ) / 100
              ).toFixed(2)}`}{" "}
            </label>
            <AddPriceModal ingredient={ingredient} />
          </div>
        );
      })}
    </ListGroup>
  );
}
