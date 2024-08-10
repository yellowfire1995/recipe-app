import _ from "lodash";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useRecipeContext } from "../../RecipeContextProvider";

function deleteIngredient(updatedRecipe, e) {
  const buttonId = e.target.id ? e.target.id : e.target.viewportElement.id;
  _.remove(
    updatedRecipe.ingredients,
    (ingredient) => ingredient.id == buttonId
  );

  return { ...updatedRecipe };
}

function handleIngredientUpdate(recipe, e) {
  console.log(parseFloat(e.target.value));
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => {
      if (ingredient.id == e.target.id) {
        const gramConversionDenominator =
          ingredient.userG || ingredient.gramConversion || 1;
        const quantityInput = isNaN(parseFloat(e.target.value))
          ? 0
          : parseFloat(e.target.value);

        return {
          ...ingredient,
          quantity: quantityInput / gramConversionDenominator,
        };
      } else {
        return { ...ingredient };
      }
    }),
  };
}

export function IngredientList({
  header,
  item,
  ingredientList,
  setIngredientList,
  buttons,
  price = "",
  headerText = "Ingredients",
  optionalIngredientHeader = "",
}) {
  const { recipe, setRecipe } = useRecipeContext();
  const [checkedArray, setCheckedArray] = useState([]);

  function handleCheck(ingredientId) {
    !checkedArray.includes(ingredientId)
      ? setCheckedArray([...checkedArray, ingredientId])
      : setCheckedArray(
          checkedArray.filter((idInclude) => idInclude !== ingredientId)
        );
  }

  const [initialDragIndex, setInitialDragIndex] = useState();
  const [draggedIngredient, setDraggedIngredient] = useState();

  function handleDragOver(index) {
    if (index != initialDragIndex) {
      const ingredientsListCopy = recipe.ingredients.filter(
        (ingredient, index) => index != initialDragIndex
      );

      setInitialDragIndex(index);

      ingredientsListCopy.splice(parseInt(index), 0, draggedIngredient);

      setRecipe({
        ...recipe,
        ingredients: ingredientsListCopy,
      });
    }
  }

  function handleDragStart(index, ingredient) {
    setInitialDragIndex(index);
    setDraggedIngredient(ingredient);
  }

  function handleDragStop() {
    setInitialDragIndex();
  }

  function handleDragEnd() {
    setInitialDragIndex();
  }

  return (
    <>
      <ListGroup>
        <Row className="d-flex align-items-center">
          <Col xs="auto">
            <h3>
              {headerText} {price}
            </h3>
          </Col>
          <Col className="p-0 d-flex">{optionalIngredientHeader}</Col>
        </Row>

        {recipe.ingredients.map((ingredient, index) => {
          if (ingredient.isGroupHeader) {
            header = {
              ...header,
              key: ingredient.id,
              props: {
                ingredient,
                index,
                handleDragStart,
                handleDragOver,
                handleDragStop,
                handleDragEnd,
                initialDragIndex,
                setInitialDragIndex,
                deleteIngredient,
                recipe,
                setRecipe,
              },
            };
            return header;
          }
          if (!ingredient.isGroupHeader) {
            item = {
              ...item,
              key: ingredient.id,
              props: {
                ingredient,
                index,
                handleDragStart,
                handleDragOver,
                handleDragStop,
                handleDragEnd,
                initialDragIndex,
                deleteIngredient,
                handleIngredientUpdate,
                recipe,
                setRecipe,
                ingredientList,
                setIngredientList,
                checkedArray,
                handleCheck,
              },
            };
            return item;
          }
        })}
      </ListGroup>
      {buttons}
    </>
  );
}
