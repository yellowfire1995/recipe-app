import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import _, { update } from "lodash";
import axios from "axios";
import AddPricePopup from "../Components/priceaddpopup.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { ingredientSearch } from "../../db/queries.js";
import AddDensityPopup from "./AddWeightModal.jsx";
import { parseIngredients } from "../../db/queries";
import { parse } from "dotenv";
import { EditSelector } from "./EditNewIngredient.jsx";

function deleteIngredient(updatedRecipe, e) {
  const buttonId = e.target.id ? e.target.id : e.target.viewportElement.id;
  _.remove(
    updatedRecipe.ingredients,
    (ingredient) => ingredient.id == buttonId
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
    quantity: 10,
    description: name,
    fdc_id: idNum,
  };
  const finalRecipe = { ...updatedRecipe.ingredients.push(ingredient) };
  return { ...updatedRecipe };
}

function handleIngredientUpdate(updatedRecipe, e) {
  return {
    ...updatedRecipe,
    ingredients: updatedRecipe.ingredients.map((ingredient) => {
      if (ingredient.description == e.target.id) {
        return {
          ...ingredient,
          quantity:
            e.target.valueAsNumber /
            (ingredient.userG || ingredient.gramConversion),
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
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [activeModal, setActiveModal] = useState();

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
                  id={ingredient.description}
                  type="number"
                  min="0"
                  step=".1"
                  className="form-check-label"
                  htmlFor={ingredient.description}
                  style={{ width: "5rem" }}
                  name={ingredient.description}
                  value={
                    ingredient.userG
                      ? Math.round(
                          ingredient.userG * ingredient.quantity * 100
                        ) / 100
                      : ingredient.gramConversion
                      ? Math.round(
                          ingredient.quantity * ingredient.gramConversion * 100
                        ) / 100
                      : ingredient.quantity
                  }
                  onChange={(e) => {
                    setUpdatedRecipe(handleIngredientUpdate(updatedRecipe, e));
                  }}
                />
                {ingredient.userLabel
                  ? ingredient.userLabel
                  : ingredient.gramConversion
                  ? ingredient.engLabel || ingredient.matchedMeasure
                  : "g"}{" "}
                {ingredient.description}{" "}
                {`(${
                  ingredient.gramConversion
                    ? parseInt(ingredient.quantity) + "g"
                    : ""
                } )`}
                <AttachMoneyIcon
                  type="button"
                  onClick={() => setActiveModal(ingredient.id)}
                />
                <DeleteIcon
                  id={ingredient.id}
                  aria-label="delete"
                  children={ingredient.id}
                  type="button"
                  onClick={(e) => {
                    setUpdatedRecipe(deleteIngredient(updatedRecipe, e));
                  }}
                  className="pt-0 mb-0"
                />
                <AddDensityPopup
                  ingredient={ingredient}
                  updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                  color={ingredient.gramConversion ? "black" : "red"}
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
          placeholder="Enter new ingredient (e.g. 1 cup flour)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>{" "}
        <button
          id="search"
          type="button"
          onClick={async (e) => setSearchResult(await parseIngredients(search))}
        >
          {" "}
          Search{" "}
        </button>
      </div>
      <ol>
        {searchResult.length > 0 ? (
          <EditSelector
            updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
            ingredients={[searchResult, setSearchResult]}
            origIdx={0}
          />
        ) : (
          "No Results"
        )}
      </ol>
    </Container>
  );
}
