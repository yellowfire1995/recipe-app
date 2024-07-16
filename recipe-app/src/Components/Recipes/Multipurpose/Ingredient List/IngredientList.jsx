import { useState } from "react";
import { useRecipeContext } from "../../RecipeContextProvider";
import ListGroup from "react-bootstrap/ListGroup";
import _ from "lodash";

function deleteIngredient(updatedRecipe, e) {
  const buttonId = e.target.id ? e.target.id : e.target.viewportElement.id;
  _.remove(
    updatedRecipe.ingredients,
    (ingredient) => ingredient.id == buttonId
  );

  return { ...updatedRecipe };
}

function handleIngredientUpdate(recipe, e) {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => {
      if (ingredient.id == e.target.id) {
        return {
          ...ingredient,
          quantity:
            e.target.valueAsNumber /
              (ingredient.userG || ingredient.gramConversion || 1) ||
            ingredient.quantity,
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
  price,
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

  if (recipe.ingredients.length > 0) {
    return (
      <>
        <ListGroup>
          <span className="h3">
            Ingredients {price} <br />
          </span>
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
}
