import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { useRecipeContext } from "../RecipeContextProvider";
import Form from "react-bootstrap/Form";

export function EditableNameField() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      <FloatingLabel label="Recipe name" className="p-0">
        <Form.Control
          size="lg"
          required
          minLength="2"
          type="text"
          value={recipe.name}
          onChange={(e) =>
            setRecipe({
              ...recipe,
              name: e.target.value,
            })
          }
        />
      </FloatingLabel>
    </>
  );
}
