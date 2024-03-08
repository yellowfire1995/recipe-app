import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/esm/Container";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import _ from "lodash";
import AddPricePopup from "../Components/priceaddpopup.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { ingredientSearch } from "../../db/queries.js";
import { ImportSelector } from "./importSelector.jsx";

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

function handleIngredientUpdate2(activeIngredientList, newIngredient) {
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

function handleIngredientUpdate(activeIngredientList, newIngredient) {
  const activeIndex = activeIngredientList.findIndex(
    (ingredient) => ingredient.id == newIngredient.id
  );

  activeIndex < 0
    ? activeIngredientList.push(newIngredient)
    : activeIngredientList.splice(activeIndex, 1, newIngredient);

  return activeIngredientList;
}

export default function IngredientsList(props) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [ingredientList, setIngredientList] = useState(
    props.ingredientsChoices
  );
  const [activeIngredientList, setActiveIngredientList] = useState([]);

  function ingredientCallBack(childData) {
    setActiveIngredientList(
      handleIngredientUpdate(activeIngredientList, childData)
    );
    props.handleCallBack(activeIngredientList);
  }

  console.log(activeIngredientList);

  useEffect(
    () => setIngredientList(props.ingredientsChoices),
    [props.ingredientsChoices]
  );

  return (
    <Container>
      <ListGroup>
        <span className="h3"> Ingredients </span>
        <InputGroup name="ingredients" className="d-flex flex-column pb-5">
          {ingredientList.map((ingredientChoices, idx) => {
            return (
              <ImportSelector
                ingredients={ingredientChoices}
                handleCallback={ingredientCallBack}
                origIdx={idx}
              />
            );
          })}
        </InputGroup>
      </ListGroup>
    </Container>
  );
}
