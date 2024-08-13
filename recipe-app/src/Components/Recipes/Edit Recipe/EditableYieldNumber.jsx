import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useRecipeContext } from "../RecipeContextProvider";

export function EditableYieldNumber() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      <FloatingLabel id="Yield number" label="Yield Number (optional)">
        <Form.Control
          type="number"
          id="yieldNumber"
          min="0"
          step=".1"
          value={recipe.yieldNumber ?? ""}
          onChange={(e) =>
            setRecipe({
              ...recipe,
              yieldNumber: isNaN(e.target.valueAsNumber)
                ? null
                : e.target.valueAsNumber,
            })
          }
        />
      </FloatingLabel>
    </>
  );
}
