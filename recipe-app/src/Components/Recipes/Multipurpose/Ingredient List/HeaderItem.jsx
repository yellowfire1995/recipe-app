import { useContext } from "react";
import { RecipeContext } from "../../../../routes/edit";
import DragHandle from "../../../../Icons/dragHandle.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function HeaderItem({
  ingredient,
  index,
  handleDragStart,
  handleDragOver,
  handleDragStop,
  initialDragIndex,
  setInitialDragIndex,
  deleteIngredient,
  updatedRecipe,
  setUpdatedRecipe,
  ...props
}) {
  return (
    <div
      key={ingredient.id}
      className={
        `form-check d-flex ps-1 ingredientItem align-items-center ` +
        `${index === initialDragIndex ? "draggedItem" : ""}`
      }
      style={{ borderRadius: "20px" }}
      draggable
      onDragStart={() => handleDragStart(index, ingredient)}
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
        setInitialDragIndex();
      }}
    >
      <div className="align-items-center d-flex">
        <DragHandle />
      </div>

      <h4 id={ingredient.id} className="m-0 align-self-center">
        {ingredient.description.toUpperCase()}
      </h4>
      <DeleteIcon
        id={ingredient.id}
        aria-label="delete"
        children={ingredient.id}
        type="button"
        onClick={(e) => {
          setUpdatedRecipe(deleteIngredient(updatedRecipe, e));
        }}
        className="pt-0 mb-0 svg-icon"
      />
      <EditIcon className="svg-icon" />
    </div>
  );
}
