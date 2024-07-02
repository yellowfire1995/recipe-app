import _ from "lodash";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button.js";
import Container from "react-bootstrap/esm/Container";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { HeaderItem } from "./HeaderItem.jsx";
import { IngredientItem } from "./IngredientItem.jsx";

function deleteIngredient(updatedRecipe, e) {
  const buttonId = e.target.id ? e.target.id : e.target.viewportElement.id;
  _.remove(
    updatedRecipe.ingredients,
    (ingredient) => ingredient.id == buttonId
  );

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
            (ingredient.userG || ingredient.gramConversion || 1),
        };
      } else {
        return { ...ingredient };
      }
    }),
  };
}

export default function IngredientsList({
  updatedRecipe,
  setUpdatedRecipe,
  ingredientList,
  setIngredientList,
}) {
  const [initialDragIndex, setInitialDragIndex] = useState();
  const [draggedIngredient, setDraggedIngredient] = useState();

  console.log(initialDragIndex);

  function handleDragOver(index) {
    if (index != initialDragIndex) {
      const ingredientsListCopy = updatedRecipe.ingredients.filter(
        (ingredient, index) => index != initialDragIndex
      );

      setInitialDragIndex(index);

      ingredientsListCopy.splice(parseInt(index), 0, draggedIngredient);

      setUpdatedRecipe({
        ...updatedRecipe,
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
    <Container>
      <ListGroup
        onDragLeave={() => {
          console.log("drag exited list");
        }}
      >
        <span className="h3"> Ingredients </span>
        <InputGroup name="ingredients" className="d-flex flex-column">
          {updatedRecipe.ingredients.map((ingredient, index) => {
            if (ingredient.isGroupHeader) {
              return (
                <>
                  <HeaderItem
                    ingredient={ingredient}
                    index={index}
                    handleDragStop={handleDragStop}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDragEnd={handleDragEnd}
                    updatedRecipe={updatedRecipe}
                    setUpdatedRecipe={setUpdatedRecipe}
                    initialDragIndex={initialDragIndex}
                    setInitialDragIndex={setInitialDragIndex}
                    deleteIngredient={deleteIngredient}
                  />
                </>
              );
            } else {
              return (
                <>
                  <IngredientItem
                    ingredient={ingredient}
                    index={index}
                    handleDragStop={handleDragStop}
                    handleDragOver={handleDragOver}
                    handleDragStart={handleDragStart}
                    updatedRecipe={updatedRecipe}
                    setUpdatedRecipe={setUpdatedRecipe}
                    initialDragIndex={initialDragIndex}
                    setInitialDragIndex={setInitialDragIndex}
                    deleteIngredient={deleteIngredient}
                    ingredientList={ingredientList}
                    setIngredientList={setIngredientList}
                    handleIngredientUpdate={handleIngredientUpdate}
                  />
                </>
              );
            }
          })}
        </InputGroup>
      </ListGroup>
      <div className="d-flex justify-content-evenly">
        {" "}
        <Button
          type="button"
          className=""
          onClick={() => {
            setUpdatedRecipe({
              ...updatedRecipe,
              ingredients: [
                ...updatedRecipe.ingredients,
                {
                  description: "New Ingredient",
                  id: uuidv4(),
                  nutrients: [],
                },
              ],
            });
          }}
        >
          Add ingredient
        </Button>
        <Button
          type="button"
          className=""
          onClick={() => {
            setUpdatedRecipe({
              ...updatedRecipe,
              ingredients: [
                ...updatedRecipe.ingredients,
                {
                  description: "New Header",
                  id: uuidv4(),
                  nutrients: [],
                  isGroupHeader: true,
                },
              ],
            });
          }}
        >
          Add header
        </Button>
      </div>
    </Container>
  );
}
