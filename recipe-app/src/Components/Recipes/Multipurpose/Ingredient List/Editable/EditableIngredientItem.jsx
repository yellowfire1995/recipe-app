import DragHandle from "../../../../../Icons/dragHandle.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIngredientModal from "../EditIngredientModal.jsx";
import AddPriceModal from "../../AddPriceModal.jsx";
import { useState } from "react";
import { IngredientError } from "./IngredientError.jsx";
import _ from "lodash";

export function EditableIngredientItem({
  ingredient,
  index,
  handleDragStart,
  handleDragOver,
  handleDragStop,
  handleDragEnd,
  initialDragIndex,
  deleteIngredient,
  handleIngredientUpdate,
  recipe,
  setRecipe,
  ingredientList,
  setIngredientList,
}) {
  const [draggable, setDraggable] = useState(true);
  const ingredientQuantity = _.round(
    ingredient.quantity * (ingredient.userG || ingredient.gramConversion || 1),
    2
  );

  const ingredientQuantityGrams =
    ingredient.userG || ingredient.gramConversion
      ? `(${_.round(ingredient.quantity)}g)`
      : "";

  const ingredientLabel = ingredient.userLabel || ingredient.engLabel || "g";
  const erroredIngredient =
    (!ingredient.matchedMeasure && !ingredient.userLabel) ||
    (!ingredient.userG && !ingredient.gramConversion);

  try {
    return (
      <div
        key={ingredient.id + ingredient.ingredientVersion}
        className={
          `form-check d-flex ps-1 ingredientItem align-items-center ` +
          `${index === initialDragIndex ? "draggedItem" : ""} ${
            erroredIngredient ? "erroredIngredient" : ""
          }`
        }
        draggable={draggable}
        style={{ borderRadius: "20px" }}
        onDragStart={() => {
          handleDragStart(index, ingredient);
        }}
        onDragEnter={() => {
          handleDragOver(index);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={() => {
          handleDragStop();
        }}
        onDragEnd={() => {
          handleDragEnd();
        }}
      >
        <div className="align-items-center d-flex ">
          <DragHandle />
        </div>
        <input
          id={ingredient.id}
          type="number"
          min=".01"
          step=".01"
          className="form-check-label ingredientAmountInput"
          htmlFor={ingredient.description}
          style={{ width: "3rem" }}
          name={ingredient.description}
          defaultValue={ingredientQuantity}
          onChange={(e) => {
            setRecipe(handleIngredientUpdate(recipe, e));
          }}
          onMouseDown={() => setDraggable(false)}
          onMouseUp={() => setDraggable(true)}
        />
        <p className="m-0 align-self-center d-flex align-items-center">
          {ingredientLabel} {ingredient.description} {ingredientQuantityGrams}
          <AddPriceModal ingredient={ingredient} />
          <EditIngredientModal
            ingredient={ingredient}
            ingredientList={ingredientList}
            setIngredientList={setIngredientList}
            origIdx={index}
          />
          <DeleteIcon
            id={ingredient.id}
            aria-label="delete"
            type="button"
            onClick={(e) => {
              setRecipe(deleteIngredient(recipe, e));
              setIngredientList(
                ingredientList.filter((ingredient, i) => i !== index)
              );
            }}
            className="pt-0 mb-0 svg-icon"
          />
          <IngredientError ingredient={ingredient} />
        </p>
      </div>
    );
  } catch (error) {
    return <div>Error importing ingredient</div>;
  }
}
