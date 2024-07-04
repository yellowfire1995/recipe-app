import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRecipeContext } from "../RecipeContextProvider";
import Form from "react-bootstrap/Form";

export function EditableYieldDescription() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      {" "}
      <FloatingLabel
        id="Yield Description"
        label="Yield Description (optional)"
        className="p-0"
      >
        <Form.Control
          type="text"
          id="yieldDescription"
          min="0"
          value={recipe.yieldDescription}
          onChange={(e) =>
            setRecipe({
              ...recipe,
              yieldDescription: e.target.value,
            })
          }
        />
      </FloatingLabel>
    </>
  );
}
