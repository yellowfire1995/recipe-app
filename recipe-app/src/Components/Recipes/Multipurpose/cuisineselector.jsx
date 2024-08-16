import { useQuery } from "@tanstack/react-query";
import { FloatingLabel } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getCuisines } from "../../../../db/queries";
import { useRecipeContext } from "../RecipeContextProvider";

export default function CuisineSelector() {
  const { recipe, setRecipe } = useRecipeContext();

  const { data, isLoading } = useQuery({
    queryKey: ["CuisineList"],
    queryFn: () => getCuisines(),
  });

  return (
    <FloatingLabel id="cuisinesLabel" label="Cuisines (optional)">
      <Typeahead
        id="cuisinesSelector"
        multiple
        options={isLoading ? [] : data}
        labelKey="cuisine"
        onChange={(selected) => setRecipe({ ...recipe, cuisine: selected })}
      />
    </FloatingLabel>
  );
}
