import DeleteIcon from "@mui/icons-material/Delete";
import _ from "lodash";
import { useState } from "react";
import DragHandle from "../../../../../Icons/dragHandle.jsx";
import AddPriceModal from "../../AddPriceModal.jsx";
import EditIngredientModal from "./EditIngredientModal.jsx";
import { IngredientError } from "./IngredientError.jsx";

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
  const [isActive, setIsActive] = useState(false);
  const {
    id,
    ingredientVersion,
    quantity,
    userG,
    gramConversion,
    userLabel,
    displayOriginalName,
    userIngredientName,
    description,
    matchedMeasure,
    unitOfMeasure,
    nutrients,
  } = ingredient;

  const ingredientQuantity = _.round(quantity * (userG || 1), 2);
  const hasQuantity = quantity > 0;

  const ingredientQuantityGrams =
    hasQuantity && (userG || gramConversion) ? `(${_.round(quantity)}g)` : "";

  const ingredientWeightLabel =
    (hasQuantity && !isActive) || isActive ? userLabel : "";

  const ingredientDescription =
    (hasQuantity && !displayOriginalName && !isActive && userIngredientName) ||
    (isActive && !displayOriginalName)
      ? description
      : userIngredientName;

  const warnedIngredient =
    (!hasQuantity && !isActive) ||
    (matchedMeasure !== unitOfMeasure && matchedMeasure === userLabel);

  const erroredIngredient =
    (!userG && !gramConversion && !warnedIngredient) || !nutrients;

  return (
    <div
      key={id + ingredientVersion}
      className={
        `form-check d-flex ps-1 ingredientItem align-items-center ` +
        `${index === initialDragIndex ? "draggedItem" : ""} ${
          erroredIngredient ? "errored-ingredient" : ""
        } ${warnedIngredient ? "warned-ingredient" : ""}`
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
        id={id}
        type="text"
        className="form-check-label ingredientAmountInput"
        htmlFor={description}
        style={{ width: "3rem" }}
        name={description}
        defaultValue={ingredientQuantity}
        onChange={(e) => {
          setRecipe(handleIngredientUpdate(recipe, e));
        }}
        onMouseDown={() => setDraggable(false)}
        onMouseUp={() => setDraggable(true)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
      <p className="m-0 align-self-center d-flex align-items-center">
        {ingredientWeightLabel} {ingredientDescription}{" "}
        {ingredientQuantityGrams}
        {!erroredIngredient && <AddPriceModal ingredient={ingredient} />}
        <EditIngredientModal
          ingredient={ingredient}
          ingredientList={ingredientList}
          setIngredientList={setIngredientList}
          origIdx={index}
        />
        <DeleteIcon
          id={id}
          aria-label="delete"
          type="button"
          onClick={(e) => {
            setRecipe(deleteIngredient(recipe, e));
            setIngredientList(
              ingredientList.filter((ingredient, i) => i !== index),
            );
          }}
          className="pt-0 mb-0 svg-icon"
        />
        <IngredientError ingredient={ingredient} />
      </p>
    </div>
  );
}
