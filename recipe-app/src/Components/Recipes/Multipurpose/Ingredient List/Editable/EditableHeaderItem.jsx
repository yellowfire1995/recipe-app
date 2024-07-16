import DragHandle from "../../../../../Icons/dragHandle.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditHeaderModal from "../EditHeaderModal.jsx";

export function EditableHeaderItem({
  ingredient,
  index,
  handleDragStart,
  handleDragOver,
  handleDragStop,
  handleDragEnd,
  initialDragIndex,
  setInitialDragIndex,
  deleteIngredient,
  recipe,
  setRecipe,
}) {
  return (
    <div
      key={ingredient.id}
      className={
        `form-check d-flex ps-1 ingredientItem align-items-center ` +
        `${index === initialDragIndex ? "draggedItem" : ""}`
      }
      draggable
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
      <div className="align-items-center d-flex">
        <DragHandle />
      </div>

      <h4 id={ingredient.id} className="m-0 align-self-center">
        {ingredient.description.toUpperCase()}
      </h4>
      <EditHeaderModal
        ingredient={ingredient}
        recipe={recipe}
        setRecipe={setRecipe}
        origIdx={index}
      />
      <DeleteIcon
        id={ingredient.id}
        aria-label="delete"
        type="button"
        onClick={(e) => {
          setRecipe(deleteIngredient(recipe, e));
        }}
        className="pt-0 mb-0 svg-icon"
      />
    </div>
  );
}
