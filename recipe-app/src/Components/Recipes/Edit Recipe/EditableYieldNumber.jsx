import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRecipeContext } from "../RecipeContextProvider";
import Form from "react-bootstrap/Form";

export function EditableYieldNumber() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      <FloatingLabel id="Yield number" label="Yield (optional)">
        <Form.Control
          type="number"
          id="yieldNumber"
          min="0"
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
