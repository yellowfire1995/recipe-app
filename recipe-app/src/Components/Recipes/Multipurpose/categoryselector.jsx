import { useQuery } from "@tanstack/react-query";
import { FloatingLabel } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getCategories as getCats } from "../../../../db/queries";
import { useRecipeContext } from "../RecipeContextProvider";

export default function CategorySelector() {
  const { recipe, setRecipe } = useRecipeContext();

  const { data, isLoading } = useQuery({
    queryKey: ["CategoryList"],
    queryFn: () => getCats(),
  });

  return (
    <FloatingLabel id="categoriesLabel" label="Categories (optional)">
      <Typeahead
        isLoading={isLoading}
        id="categoriesSelector"
        multiple
        options={isLoading ? [] : data}
        labelKey="category"
        onChange={(selected) => setRecipe({ ...recipe, category: selected })}
      />
    </FloatingLabel>
  );
}
