import { useEffect, useState } from "react";
import { FloatingLabel } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getCuisines } from "../../../../db/queries";

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
    <FloatingLabel id="cuisinesLabel" label="Cuisines (optional)">
      <Typeahead
        id="cuisinesSelector"
        multiple
        options={cuisines}
        labelKey="cuisine"
        onChange={(selected) =>
          setUpdatedRecipe({ ...updatedRecipe, cuisine: selected })
        }
      />
    </FloatingLabel>
  );
}
