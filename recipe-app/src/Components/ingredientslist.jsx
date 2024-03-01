import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import _ from "lodash";
import AddPricePopup from "../Components/priceaddpopup.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { ingredientSearch } from "../../db/queries.js";

function deleteIngredient(updatedRecipe, e) {
  const currentRecipe = _.remove(
    updatedRecipe.ingredients,
    (ingredient) => ingredient.id == e.target.id
  );

  return { ...updatedRecipe };
}

function addNewIngredient(updatedRecipe, idNum, name) {
  const currentLastingredient =
    updatedRecipe.ingredients.length > 0
      ? _.last(updatedRecipe.ingredients).id
      : 0;

  const ingredient = {
    recipe_id: updatedRecipe.recipe_id,
    id: 1 + currentLastingredient,
    amt: 10,
    ingredient: name,
    fdc_id: idNum,
  };
  const finalRecipe = { ...updatedRecipe.ingredients.push(ingredient) };
  return { ...updatedRecipe };
}

function handleIngredientUpdate(updatedRecipe, e) {
  return {
    ...updatedRecipe,
    ingredients: updatedRecipe.ingredients.map((ingredient) => {
      if (ingredient.ingredient == e.target.id) {
        return {
          ...ingredient,
          amt: e.target.valueAsNumber,
        };
      } else {
        return { ...ingredient };
      }
    }),
  };
}

export default function IngredientsList(props) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = useState(props.recipe);
  const [activeModal, setActiveModal] = useState();

  useEffect(
    () => props.handleCallBack(updatedRecipe.ingredients),
    [updatedRecipe]
  );

  useEffect(() => setUpdatedRecipe(props.recipe), [props.recipe]);

  return (
    <Container>
      <ListGroup>
        <span className="h3"> Ingredients </span>
        <InputGroup name="ingredients" className="d-flex flex-column">
          {updatedRecipe.ingredients.map((ingredient) => {
            return (
              <div className="form-check" key={ingredient.id}>
                <AddPricePopup
                  show={activeModal == ingredient.id ? true : false}
                  onHide={() => setActiveModal()}
                  ingredient={ingredient}
                />
                <input
                  id={ingredient.ingredient}
                  type="number"
                  min="0"
                  step=".01"
                  className="form-check-label"
                  htmlFor={ingredient.ingredient}
                  style={{ width: "5rem" }}
                  name={ingredient.ingredient}
                  value={ingredient.amt}
                  onChange={(e) => {
                    setUpdatedRecipe(handleIngredientUpdate(updatedRecipe, e));
                  }}
                />
                g {ingredient.ingredient}
                <AttachMoneyIcon
                  type="button"
                  onClick={() => setActiveModal(ingredient.id)}
                  style={{
                    color: `${ingredient.package_cost ? "black" : "red"}`,
                  }}
                />
                <DeleteIcon
                  id={ingredient.id}
                  aria-label="delete"
                  type="button"
                  onClick={(e) => {
                    setUpdatedRecipe(deleteIngredient(updatedRecipe, e));
                  }}
                  className="pt-0 mb-0"
                />
                <span style={{ color: "red" }}>
                  {" "}
                  {ingredient.fdc_id
                    ? null
                    : `Ingredient did not match - please try again`}
                </span>
              </div>
            );
          })}
        </InputGroup>
      </ListGroup>
      <div>
        <input
          id="search"
          type="textbox"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        ></input>{" "}
        <button
          id="search"
          type="submit"
          onClick={async (e) =>
            setSearchResult(await ingredientSearch(e, search))
          }
        >
          {" "}
          Search{" "}
        </button>
      </div>
      <ol>
        {searchResult.length > 0
          ? searchResult.map((ingredient) => {
              return (
                <div key={ingredient.fdc_id}>
                  <li>
                    <div>
                      {ingredient.description}
                      <button
                        type="button"
                        id={[ingredient.fdc_id]}
                        onClick={(e) => {
                          setUpdatedRecipe(
                            addNewIngredient(
                              updatedRecipe,
                              ingredient.fdc_id,
                              ingredient.description
                            )
                          );
                        }}
                      >
                        {" "}
                        Add{" "}
                      </button>{" "}
                      <br />
                      {ingredient.fdc_id}
                    </div>
                  </li>
                </div>
              );
            })
          : "No Results"}
      </ol>
    </Container>
  );
}
