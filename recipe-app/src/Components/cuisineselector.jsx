import { useEffect, useState } from "react";
import { getCuisines } from "../../db/queries";
import { Typeahead } from "react-bootstrap-typeahead";

export default function CuisineSelector(props) {
  const [cuisines, setCuisines] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  useEffect(() => {
    async function startFetching() {
      const result = await getCuisines();
      setCuisines(result);
    }

    startFetching();
  }, []);

  return (
    <Typeahead
      id="categories"
      multiple
      options={cuisines}
      labelKey="cuisine"
      placeholder="Cuisines (optional)"
      onChange={(selected) =>
        setUpdatedRecipe({ ...updatedRecipe, cuisine: selected })
      }
    />
  );
}
