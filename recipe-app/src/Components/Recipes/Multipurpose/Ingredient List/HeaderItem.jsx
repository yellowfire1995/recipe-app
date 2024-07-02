import DragHandle from "../../../../Icons/dragHandle.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditHeaderModal from "./EditHeaderModal.jsx";

export function HeaderItem({
  ingredient,
  index,
  handleDragStart,
  handleDragOver,
  handleDragStop,
  handleDragEnd,
  initialDragIndex,
  setInitialDragIndex,
  deleteIngredient,
  updatedRecipe,
  setUpdatedRecipe,
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
      onDragStart={() => {
        handleDragStart(index, ingredient);
      }}
      onDragEnter={() => {
        handleDragOver(index);
        console.log("header drag entered");
      }}
      onDragOver={(e) => {
        console.log("header dragged over");
        e.preventDefault();
      }}
      onDrop={() => {
        console.log("header dropped");
        handleDragStop();
      }}
      onDragEnd={() => {
        handleDragEnd();
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
        type="button"
        onClick={(e) => {
          setUpdatedRecipe(deleteIngredient(updatedRecipe, e));
        }}
        className="pt-0 mb-0 svg-icon"
      />
      <EditHeaderModal
        ingredient={ingredient}
        updatedRecipe={updatedRecipe}
        setUpdatedRecipe={setUpdatedRecipe}
        origIdx={index}
      />
    </div>
  );
}
