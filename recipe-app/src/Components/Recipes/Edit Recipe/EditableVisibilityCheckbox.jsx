import { useRecipeContext } from "../RecipeContextProvider";
import Form from "react-bootstrap/Form";

export function EditableVisibilityCheckbox() {
  const { recipe, setRecipe } = useRecipeContext();

  return (
    <>
      {" "}
      <h5 className="pe-2">Visibility: </h5>
      <Form.Check
        inline
        type="checkbox"
        checked={recipe.public}
        onChange={() =>
          setRecipe({
            ...recipe,
            public: true,
          })
        }
        label="Public"
      />
      <Form.Check
        inline
        type="checkbox"
        checked={!recipe.public}
        onChange={() =>
          setRecipe({
            ...recipe,
            public: false,
          })
        }
        label="Private"
      />
    </>
  );
}
