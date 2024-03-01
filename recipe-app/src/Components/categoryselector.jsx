import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getCategories as getCats } from "../../db/queries";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function updateCategories(updatedRecipe, newCategories) {
  console.log(newCategories);
  return {
    ...updatedRecipe,
    category: newCategories,
  };
}

export default function CategorySelector(props) {
  const [categories, setCategories] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = useState(props.recipe);

  useEffect(() => {
    async function startFetching() {
      const result = await getCats();
      setCategories(result);
    }

    startFetching();
  }, []);

  useEffect(
    () => props.handleCallBack(updatedRecipe.category),
    [updatedRecipe]
  );

  return (
    <Autocomplete
      onChange={async (event, value) => {
        setUpdatedRecipe(
          await updateCategories(
            updatedRecipe,
            value.map((category) => {
              return {
                category_id: category.category_id,
                category: category.category,
              };
            })
          )
        );
      }}
      multiple
      id="categories"
      options={categories}
      disableCloseOnSelect
      value={updatedRecipe.category.map(({ category, category_id }) => ({
        category: category,
        category_id: category_id,
      }))}
      getOptionLabel={(option) => option.category}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.category}
        </li>
      )}
      style={{ width: 400 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Categories"
          placeholder="Select categories"
        />
      )}
    />
  );
}
