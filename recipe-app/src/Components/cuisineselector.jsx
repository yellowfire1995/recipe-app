import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getCuisines } from "../../db/queries";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function updateCuisines(updatedRecipe, newCuisines) {
  return {
    ...updatedRecipe,
    cuisine: newCuisines,
  };
}

export default function CuisineSelector(props) {
  const [cuisines, setCuisines] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = useState(props.recipe);

  useEffect(() => {
    async function startFetching() {
      const result = await getCuisines();
      setCuisines(result);
    }

    startFetching();
  }, []);

  useEffect(() => props.handleCallBack(updatedRecipe.cuisine), [updatedRecipe]);

  return (
    <Autocomplete
      onChange={async (event, value) => {
        console.log(value);
        setUpdatedRecipe(
          await updateCuisines(
            updatedRecipe,
            value.map(({ cuisine, cuisine_id }) => {
              return { cuisine: cuisine, cuisine_id: cuisine_id };
            })
          )
        );
      }}
      multiple
      id="cuisines"
      options={cuisines}
      value={updatedRecipe.cuisine.map(({ cuisine, cuisine_id }) => ({
        cuisine: cuisine,
        cuisine_id: cuisine_id,
      }))}
      disableCloseOnSelect
      getOptionLabel={(option) => option.cuisine}
      isOptionEqualToValue={(option, value) => option.cuisine === value.cuisine}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.cuisine_id} id={option.cuisine_id}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.cuisine}
        </li>
      )}
      style={{ width: 400 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cuisines"
          placeholder="Select cuisine(s)"
        />
      )}
    />
  );
}
