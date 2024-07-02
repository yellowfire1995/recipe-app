import DragHandle from "../../../../Icons/dragHandle.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIngredientModal from "./EditIngredientModal.jsx";
import AddPriceModal from "../AddPriceModal.jsx";

export function IngredientItem({
  ingredient,
  index,
  handleDragStart,
  handleDragOver,
  handleDragStop,
  initialDragIndex,
  deleteIngredient,
  handleIngredientUpdate,
  updatedRecipe,
  setUpdatedRecipe,
  ingredientList,
  setIngredientList,
}) {
  try {
    return (
      <div
        className={
          `form-check ps-1 d-flex ingredientItem ` +
          `${index === initialDragIndex ? "draggedItem" : ""}`
        }
        style={{ borderRadius: "20px" }}
        key={ingredient.id}
        id={ingredient.id}
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
        onDragEnd={(e) => e.target.classList.remove("draggedItem")}
      >
        <div className="align-items-center d-flex ">
          <DragHandle />
        </div>
        <input
          id={ingredient.description}
          type="number"
          min="0"
          step=".01"
          className="form-check-label"
          htmlFor={ingredient.description}
          style={{ width: "3rem" }}
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
            setUpdatedRecipe(handleIngredientUpdate(updatedRecipe, e));
          }}
        />
        <p className="m-0 align-self-center">
          {ingredient.userLabel
            ? ingredient.userLabel
            : ingredient.gramConversion
            ? ingredient.engLabel || ingredient.matchedMeasure
            : "g"}{" "}
          {ingredient.description}{" "}
          {`(${
            ingredient.gramConversion || ingredient.userG
              ? parseInt(ingredient.quantity) + "g"
              : ""
          } )`}
          <AddPriceModal ingredient={ingredient} />
          <EditIngredientModal
            ingredient={ingredient}
            updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
            color={
              ingredient.gramConversion || ingredient.userG ? "black" : "red"
            }
            ingredientList={[ingredientList, setIngredientList]}
            origIdx={index}
          />
          <DeleteIcon
            id={ingredient.id}
            aria-label="delete"
            type="button"
            onClick={(e) => {
              setUpdatedRecipe(deleteIngredient(updatedRecipe, e));
              setIngredientList(
                ingredientList.filter((ingredient, i) => i !== index)
              );
            }}
            className="pt-0 mb-0 svg-icon"
          />
          <span style={{ color: "red" }}>
            {" "}
            {ingredient.fdc_id
              ? null
              : `Ingredient needs information - please edit`}
            {ingredient.nutrients.length > 0
              ? ""
              : "Warning! No nutrition information"}
          </span>
        </p>
      </div>
    );
  } catch (error) {
    return <div>Error importing ingredient</div>;
  }
}
