import { useEffect, useState } from "react";
import { FloatingLabel } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { getCategories as getCats } from "../../../../db/queries";

export default function CategorySelector(props) {
  const [categories, setCategories] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;

  useEffect(() => {
    async function startFetching() {
      const result = await getCats();
      setCategories(result);
    }

    startFetching();
  }, []);

  return (
    <FloatingLabel id="categoriesLabel" label="Categories (optional)">
      <Typeahead
        id="categoriesSelector"
        multiple
        options={categories}
        labelKey="category"
        onChange={(selected) =>
          setUpdatedRecipe({ ...updatedRecipe, category: selected })
        }
      />
    </FloatingLabel>
  );
}
