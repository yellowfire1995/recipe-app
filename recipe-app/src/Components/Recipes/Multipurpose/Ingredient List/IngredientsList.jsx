import DeleteIcon from "@mui/icons-material/Delete";
import _ from "lodash";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button.js";
import Container from "react-bootstrap/esm/Container";
import { v4 as uuidv4 } from "uuid";
import EditIngredientModal from "./EditIngredientModal.jsx";
import AddPriceModal from "../AddPriceModal.jsx";
import { useState } from "react";
import DragHandle from "../../../../Icons/dragHandle.jsx";

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

// function handleDrop(e, index) {
//   const draggedOverIndex = index;
//   const initialItemIndex = parseInt(e.dataTransfer.getData("text/plain"));
//   console.log(draggedOverIndex - initialItemIndex);
// }

export default function IngredientsList(props) {
  const [updatedRecipe, setUpdatedRecipe] = props.updatedRecipe;
  const [ingredientList, setIngredientList] = props.ingredientList;
  // const [activeDragOver, setActiveDragOver] = useState();
  const [initialDragIndex, setInitialDragIndex] = useState();
  const [draggedIngredient, setDraggedIngredient] = useState();

  console.log(updatedRecipe.ingredients);

  function handleDragOver(index) {
    console.log(initialDragIndex);

    if (index != initialDragIndex) {
      const ingredientsListCopy = updatedRecipe.ingredients.filter(
        (ingredient, index) => index != initialDragIndex
      );

      setInitialDragIndex(index);

      const updateIngredients = ingredientsListCopy.splice(
        parseInt(index),
        0,
        draggedIngredient
      );
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

  return (
    <Container>
      <ListGroup>
        <span className="h3"> Ingredients </span>
        <InputGroup name="ingredients" className="d-flex flex-column ">
          {updatedRecipe.ingredients.map((ingredient, index) => {
            if (ingredient.isGroupHeader) {
              return (
                <h4
                  key={ingredient.id}
                  id={ingredient.id}
                  draggable
                  onDragStart={() => handleDragStart(index, ingredient)}
                  onDragEnter={() => handleDragOver(index, ingredient.id)}
                  onDragEnd={() => setInitialDragIndex()}
                >
                  {ingredient.description.toUpperCase()}
                </h4>
              );
            } else {
              try {
                return (
                  <div
                    className={`form-check ps-1 d-flex`}
                    key={ingredient.id}
                    id={ingredient.id}
                    draggable
                    onDragStart={() => handleDragStart(index, ingredient)}
                    onDragEnter={() => handleDragOver(index, ingredient.id)}
                    onDragEnd={() => setInitialDragIndex()}
                  >
                    <DragHandle />
                    <input
                      id={ingredient.description}
                      type="number"
                      min="0"
                      step=".01"
                      className="form-check-label"
                      htmlFor={ingredient.description}
                      style={{ width: "3rem" }}
                      name={ingredient.description}
                      value={
                        ingredient.userG
                          ? Math.round(
                              ingredient.userG * ingredient.quantity * 100
                            ) / 100
                          : ingredient.gramConversion
                          ? Math.round(
                              ingredient.quantity *
                                ingredient.gramConversion *
                                100
                            ) / 100
                          : ingredient.quantity
                      }
                      onChange={(e) => {
                        setUpdatedRecipe(
                          handleIngredientUpdate(updatedRecipe, e)
                        );
                      }}
                    />
                    {ingredient.userLabel
                      ? ingredient.userLabel
                      : ingredient.gramConversion
                      ? ingredient.engLabel || ingredient.matchedMeasure
                      : "g"}{" "}
                    {ingredient.description}{" "}
                    {`(${
                      ingredient.gramConversion || ingredient.userG
                        ? parseInt(ingredient.quantity) + "g"
                        : ""
                    } )`}
                    <AddPriceModal ingredient={ingredient} />
                    <EditIngredientModal
                      ingredient={ingredient}
                      updatedRecipe={[updatedRecipe, setUpdatedRecipe]}
                      color={
                        ingredient.gramConversion || ingredient.userG
                          ? "black"
                          : "red"
                      }
                      ingredientList={[ingredientList, setIngredientList]}
                      origIdx={index}
                    />
                    <DeleteIcon
                      id={ingredient.id}
                      aria-label="delete"
                      children={ingredient.id}
                      type="button"
                      onClick={(e) => {
                        setUpdatedRecipe(deleteIngredient(updatedRecipe, e));
                        setIngredientList(
                          ingredientList.filter((ingredient, i) => i !== index)
                        );
                      }}
                      className="pt-0 mb-0 svg-icon"
                    />
                    <span style={{ color: "red" }}>
                      {" "}
                      {ingredient.fdc_id
                        ? null
                        : `Ingredient needs information - please edit`}
                      {ingredient.nutrients.length > 0
                        ? ""
                        : "Warning! No nutrition information"}
                    </span>
                  </div>
                );
              } catch (error) {
                return <div>Error importing ingredient</div>;
              }
            }
          })}
        </InputGroup>
      </ListGroup>
      <Button
        type="button"
        className="w-100"
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
    </Container>
  );
}
