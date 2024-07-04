import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRecipeContext } from "../RecipeContextProvider";
import Form from "react-bootstrap/Form";

export function EditableServingsField() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      {" "}
      <FloatingLabel id="servings" label="Servings" className="p-0">
        <Form.Control
          required
          type="number"
          id="servings"
          min="0"
          value={recipe.servings}
          onChange={(e) =>
            setRecipe({
              ...recipe,
              servings: e.target.value,
            })
          }
        />
      </FloatingLabel>
    </>
  );
}
