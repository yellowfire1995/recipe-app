import { useEffect, useState } from "react";
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
    <Typeahead
      id="categories"
      multiple
      options={categories}
      labelKey="category"
      placeholder="Categories (optional)"
      onChange={(selected) =>
        setUpdatedRecipe({ ...updatedRecipe, category: selected })
      }
    />
  );
}
